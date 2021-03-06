
## For game developers

Refer to the [app faq](https://itch.io/docs/app/faq) to know how to get your game running!

## Installing

itch is built in HTML/SCSS/ES6 and runs inside of Electron. Install the
following to get started with development:

* Install [node.js][] (version *4.2.x* is recommended, tests won't run on anything lower)
* Install [electron][]:

[node.js]: https://nodejs.org/
[electron]: https://github.com/atom/electron

```
npm install -g electron-prebuilt@0.35.4
```

**N.B: 0.36.0 is known not to work with itch, 0.35.4 is the recommended release**

* Install [sassc][] following the instructions for [Unix][sassc-unix] or
  [Windows][sassc-win].  Make sure it's in your `$PATH`.

[sassc]: https://github.com/sass/sassc
[sassc-unix]: https://github.com/sass/sassc/blob/master/docs/building/unix-instructions.md
[sassc-win]: https://github.com/sass/sassc/blob/master/docs/building/windows-instructions.md

* Check out this repository

* Install the javascript dependencies:

```bash
$ npm install
```

* You can now run the app:

```bash
$ npm start
```

Running the app like that will be slower than a release, as it compiles
files as they are loaded, with [babel][]'s require hook.

We use [grunt][] for packaging, see our [CI job definitions][ci].

[babel]: http://babeljs.io/
[grunt]: https://github.com/gruntjs/grunt
[ci]: https://github.com/itchio/ci.itch.ovh/blob/master/src/jobs/itch.yml

### Running tests

Run:

```bash
$ npm test
```

To run all tests. You can run a single test with:

```bash
$ test/runner.js test/util/os-spec.js | tap-spec
```

Piping to [tap-spec][] is optional, but neat. Make you sure `npm install -g
tap-spec` if you haven't already.

[tap-spec]: https://github.com/scottcorgan/tap-spec

### Debug facilities

**:memo: When running from msys, `export OS=cygwin` to see log output**

These keys do things:

  * `Shift-F5` — reload the UI. Since the state is stored outside of the browser,
    this shouldn't corrupt 
  * `F12` — open Chrome Devtools

These environment variables will change the behavior of the app:

  * `DEVTOOLS=1` — start with Chrome Devtools open — useful when something goes
    wrong before the `F12` binding becomes available.
  * `MARCO_POLO=1` — dumps all Flux events being dispatched throughout the app.
    We attempt to filter that (see `private` field in payloads) but **please
    pay extra care to any logs you post publicly** to make sure you're not leaking
    your own credentials.
  * `LET_ME_IN=1` — dump itch.io API calls to console
  * `DANGER_ZONE=1` — enable `Danger Zone` Help submenu with crashing options
  * `DIEGO_IS_ASLEEP=1` - forbid [our diagnostics tool][diego] from running commands like
    `uname`, `lspci`, `sw_vers`, `wmic`, and `ver` on your system and writing
    the results to a file on your local disk.
  * `CAST_NO_SHADOW=1` — opens devtools for the purchase window
  * `NO_TEACHING=1` — disable featured collections (useful to debug data transfer
    between node and browser side)
  * `TRUST_ME_IM_AN_ENGINEER=1` - never show `Buy now` instead of `Install`.
    Obviously, the backend has to agree with you.

[diego]: diego.md

