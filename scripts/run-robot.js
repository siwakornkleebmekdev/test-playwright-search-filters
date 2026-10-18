import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const requestedTestCase = process.argv[2];

if (requestedTestCase && !/^TC-SEARCH-(0[1-9])$/.test(requestedTestCase)) {
  console.error('Test case must be between TC-SEARCH-01 and TC-SEARCH-09.');
  process.exit(2);
}

const localExecutables = process.platform === 'win32'
  ? [
      path.join(projectRoot, '.venv', 'Scripts', 'robot.exe'),
      path.join(projectRoot, '.robot-python', 'bin', 'robot.exe'),
    ]
  : [
      path.join(projectRoot, '.venv', 'bin', 'robot'),
      path.join(projectRoot, '.robot-python', 'bin', 'robot'),
    ];

const robotExecutable = process.env.ROBOT_EXECUTABLE
  || localExecutables.find(existsSync)
  || 'robot';

const childEnvironment = { ...process.env };
const localPackageDirectory = path.join(projectRoot, '.robot-python');
if (robotExecutable.startsWith(localPackageDirectory)) {
  childEnvironment.PYTHONPATH = [
    localPackageDirectory,
    childEnvironment.PYTHONPATH,
  ].filter(Boolean).join(path.delimiter);
}

const args = [
  '--name',
  'Test Scenario: ระบบค้นหาและกรองโพสต์',
  '--outputdir',
  'robot-results',
];

if (requestedTestCase) {
  args.push('--include', requestedTestCase);
}

args.push('robot-tests/tests/TC-SEARCH_search_and_filter.robot');

const result = spawnSync(robotExecutable, args, {
  cwd: projectRoot,
  env: childEnvironment,
  shell: false,
  stdio: 'inherit',
});

if (result.error) {
  console.error(`Unable to start Robot Framework: ${result.error.message}`);
  console.error('Run "npm run robot:install" inside an activated Python virtual environment first.');
  process.exit(1);
}

process.exit(result.status ?? 1);
