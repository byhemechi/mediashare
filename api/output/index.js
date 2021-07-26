'use strict';

var express = require('express');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth2');
var dotenv = require('dotenv');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var passport__default = /*#__PURE__*/_interopDefaultLegacy(passport);
var OAuth2Strategy__default = /*#__PURE__*/_interopDefaultLegacy(OAuth2Strategy);
var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

// Nothing really goes on the index route, just send a simple "hello" message
var IndexRoute = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.header("Content-Type", "text/plain");
        res.send("hi");
        return [2 /*return*/];
    });
}); };

var _a, _b, _c;
dotenv__default['default'].config();
// Set the server port via `PORT` env variable, falling back to `8080`
var port = parseInt((_a = process.env) === null || _a === void 0 ? void 0 : _a.PORT) || 8080;
var hostname = (_c = (_b = process.env) === null || _b === void 0 ? void 0 : _b.HOSTNAME) !== null && _c !== void 0 ? _c : "localhost";

var initAuth = function (app) {
    if (!process.env.TWITCH_CLIENT)
        throw "Missing Twitch Client ID";
    if (!process.env.TWITCH_SECRET)
        throw "Missing Twitch Secret";
    passport__default['default'].use(new OAuth2Strategy__default['default']({
        authorizationURL: "https://id.twitch.tv/oauth2/authorize",
        tokenURL: "https://id.twitch.tv/oauth2/token",
        clientID: process.env.TWITCH_CLIENT,
        clientSecret: process.env.TWITCH_SECRET,
        callbackURL: "https://" + hostname + (!!port ? ":" + port : "") + "/"
    }, function (accessToken, refreshToken, profile, done) {
        // TODO: DB auth
    }));
    app.get("/auth/twitch", passport__default['default'].authenticate("twitch"));
    app.get("/auth/twitch/callback", passport__default['default'].authenticate("twitch", { failureRedirect: "/" }), function (req, res) {
        // Successful authentication, redirect home.
        res.redirect("/");
    });
};

var app = express__default['default']();
// Simple homepage route
app.get("/", IndexRoute);
// Authentication
initAuth(app);
// Listen on `port` and log to console
app.listen(port, function () { return console.info("Server Listening on port " + port); });
