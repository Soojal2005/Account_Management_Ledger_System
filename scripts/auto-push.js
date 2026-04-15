#!/usr/bin/env node

import { execFileSync } from "node:child_process";

function runGit(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim();
}

function runGitInherit(args) {
  execFileSync("git", args, { stdio: "inherit" });
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimestamp() {
  const now = new Date();
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate())
  ].join("") + "-" + [pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join("");
}

function isValidBranchPrefix(value) {
  return /^[a-zA-Z0-9._/-]+$/.test(value);
}

function main() {
  const args = process.argv.slice(2);
  const branchPrefix = args[0] || "auto/update";
  const customMessage = args.slice(1).join(" ").trim();

  if (!isValidBranchPrefix(branchPrefix)) {
    console.error("Invalid branch prefix. Use letters, numbers, '.', '_', '-', and '/'.");
    process.exit(1);
  }

  try {
    runGit(["rev-parse", "--is-inside-work-tree"]);
  } catch {
    console.error("This command must be run inside a Git repository.");
    process.exit(1);
  }

  const status = runGit(["status", "--porcelain"]);
  if (!status) {
    console.log("No changes detected. Nothing to commit.");
    return;
  }

  try {
    runGit(["remote", "get-url", "origin"]);
  } catch {
    console.error("Git remote 'origin' was not found. Add it before pushing.");
    process.exit(1);
  }

  const branchName = `${branchPrefix}-${getTimestamp()}`;

  runGitInherit(["checkout", "-b", branchName]);
  runGitInherit(["add", "-A"]);

  const stagedFiles = runGit(["diff", "--cached", "--name-only"]).split("\n").filter(Boolean);
  const autoMessage = `chore: auto-commit ${stagedFiles.length} file(s)`;
  const commitMessage = customMessage || autoMessage;

  runGitInherit(["commit", "-m", commitMessage]);
  runGitInherit(["push", "-u", "origin", branchName]);

  console.log(`\nDone. Branch '${branchName}' created, committed, and pushed.`);
}

main();
