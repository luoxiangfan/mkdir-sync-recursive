import fs from 'node:fs';
import nodePath from 'node:path';
import type { MakeDirectoryOptions } from 'node:fs';

type MakeDirectoryRecursiveOptions = Omit<MakeDirectoryOptions, 'recursive'>;

const validateUint32 = (value: unknown, name: string) => {
  if (typeof value !== 'number') {
    throw new Error(`${name}: ${value} is not number`);
  }
  if (!Number.isInteger(value)) {
    throw new Error(`${name}: ${value} is not an integer`);
  }
  const min = 0;
  // 2 ** 32 === 4294967296
  const max = 4_294_967_295;
  if (value < min || value > max) {
    throw new Error(`${name}: ${value} must >= ${min} && <= ${max}`);
  }
};

function parseFileMode(value: unknown, name: string, def?: number) {
  value ??= def;
  if (typeof value === 'string') {
    if (!/^[0-7]+$/.test(value)) {
      throw new Error(`${name}: ${value} is invalid`);
    }
    value = Number.parseInt(value, 8);
  }

  validateUint32(value, name);
  return value as number;
}

function mkdirSyncRecursive(
  path: string,
  options?: string | number | MakeDirectoryRecursiveOptions
) {
  let mode = 0o777;
  if (typeof options === 'number' || typeof options === 'string') {
    mode = parseFileMode(options, 'mode');
  } else if (options) {
    if (options.mode !== undefined) {
      mode = parseFileMode(options.mode, 'options.mode');
    }
  }
  const dirs = path.split('/');
  let dirPath = '';
  const result: string[] = [];
  for (const dir of dirs) {
    dirPath += `${dir}/`;
    mkdir(dirPath, mode);
  }
  function mkdir(path: string, mode: MakeDirectoryOptions['mode']) {
    if (!fs.existsSync(dirPath)) {
      try {
        fs.mkdirSync(path, mode);
        result.push(path);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return undefined;
  }
  return result.length ? nodePath.resolve(result[0]) : undefined;
}

export { mkdirSyncRecursive as default };
