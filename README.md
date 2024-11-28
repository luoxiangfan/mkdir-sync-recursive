# mkdir-sync-recursive
Synchronously and recursively creates a directory. Returns undefined or the first directory path created.

## Installation

```js
npm install mkdir-sync-recursive
```

## Usage

```js
import mkdirSyncRecursive from 'mkdir-sync-recursive'

// Returns undefined, or the first directory path created.
mkdirSyncRecursive('/path/source')

// Returns undefined, or the first directory path created of each path.
mkdirSyncRecursive(['test', 'build/scripts', 'test/html'])
```