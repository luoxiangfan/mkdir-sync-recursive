import { existsSync, mkdirSync } from 'node:fs';
import { sep, resolve } from 'node:path';
import { isArray, parseFileMode } from './util.js';
import type {
  MakeDirectoryOptions,
  MakeDirectoryRecursiveOptions
} from './type.js';

function mkdirp(
  path: string,
  options?: string | number | MakeDirectoryRecursiveOptions
) {
  let mode = 0o777;
  if (typeof options === 'number' || typeof options === 'string') {
    mode = parseFileMode(options, 'mode');
  } else if (options?.mode) {
    mode = parseFileMode(options.mode, 'options.mode');
  }
  const _sep = path.includes('/') ? '/' : sep;
  const dirs = path.split(_sep);
  let dir = '';
  const result: string[] = [];
  for (const d of dirs) {
    dir += `${d}${_sep}`;
    mkdir(dir, mode);
  }
  function mkdir(path: string, mode: MakeDirectoryOptions['mode']) {
    if (!existsSync(dir)) {
      try {
        mkdirSync(path, mode);
        result.push(path);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return undefined;
  }
  return result.length ? resolve(result[0]) : undefined;
}

function mkdirSyncRecursive(
  path: string | string[],
  options?: string | number | MakeDirectoryRecursiveOptions
) {
  let mpath: string | (string | undefined)[] | undefined;
  if (typeof path === 'string') {
    mpath = mkdirp(path, options);
  } else {
    mpath = [];
    for (const p of path) {
      mpath.push(mkdirp(p, options));
    }
  }
  return isArray(mpath) ? (mpath.some((m) => !!m) ? mpath : undefined) : mpath;
}

export { mkdirSyncRecursive as default };
