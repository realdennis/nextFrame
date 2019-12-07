<span class="badge-github-actions"><a href="https://github.com/realdennis/nextFrame" title="View this project on GitHub"><img src="https://github.com/realdennis/nextFrame/workflows/Node%20CI/badge.svg" alt="GitHub Actions" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@realdennis/next-frame" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@realdennis/next-frame.svg" alt="NPM downloads" /></a></span>

# nextFrame

A promisify of `window.requestAnimationFrame`, you can use this in your async function to slice the long callback bottleneck to improve performance and avoid frame drop in your callback.

## Why use nextFrame instead of requestAnimationFrame?

Since requestAnimationFrame is a callback usage, if we want to deal with complexity flow, the callback hell would be crap.

## Installation

```bash
$ npm install @realdennis/next-frame
```

## Usage

It expose three methods `nextFrame` / `perFrameReduccer` / `perFrameMapper` for difference purpose.

```javascript
// ESModule
import {
  nextFrame,
  perFrameReduccer,
  perFrameMapper
} from "https://unpkg.com/@realdennis/next-frame/dist/index.mjs";
```

### nextFrame

```javascript
import { nextFrame } from '@realdennis/next-frame';

window.onclick = async ()=>{
    await nextFrame()
    /**
     * ... something click callback step1
     */
    chunk1();
    await nextFrame()
    /**
     * ... something click callback step2
     */
    chunk2();
    await nextFrame()
    /**
     * ... something click callback step3
     */
    chunk3()
}
```
These 3 chunk will be execute in 3 serial different frame, and share the same closure variable, race-safe.


### perFrameReducer

It provides `perFrameReducer`, an array reduce callback, reduce the callback array to promise, and schedule it all to different frame like above.

```javascript
import { perFrameReducer } from '@realdennis/next-frame';

window.onclick = async ()=>{
    await [chunk1,chunk2,chunk3].reduce(perFrameReducer)
    console.log('Done')
}
```

### perFrameMapper

It provides `perFrameMapper`, an array map callback, map the callback array to promised callback array, and each promised callback has itself start frame.

```javascript
import { perFrameMapper } from '@realdennis/next-frame';

window.onclick = async (){
    const scheduledChunks =  [chunk1,chunk2,chunk3].map(perFrameMapper);
    //[chunk1InFrame1func , chunk2InFrame2func, chunk3InFrame3func]
    Promise.all(scheduledChunks.map(cb=>cb()))
        .then(console.log('concurrent done'));
}
```

## License

LICENSE MIT © 2019 realdennis
