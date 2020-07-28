var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var maker_base_1 = require('@electron-forge/maker-base');
var fs_extra_1 = require('fs-extra');
var path_1 = require('path');
var resolveCommand_1 = require('cross-spawn/lib/util/resolveCommand');
var electron_windows_store_1 = require('electron-windows-store');
var sign_1 = require('electron-windows-store/lib/sign');
var author_name_1 = require('./author-name');
// NB: This is not a typo, we require AppXs to be built on 64-bit
// but if we're running in a 32-bit node.js process, we're going to
// be Wow64 redirected
var windowsSdkPaths = [
    'C:\\Program Files\\Windows Kits\\10\\bin\\x64',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64',
];
async;
function findSdkTool(exe) {
    var sdkTool;
    for (var _i = 0; _i < windowsSdkPaths.length; _i++) {
        var testPath = windowsSdkPaths[_i];
        if (await)
            fs_extra_1["default"].pathExists(testPath);
        {
            var testExe = path_1["default"].resolve(testPath, exe);
            if (await)
                fs_extra_1["default"].pathExists(testExe);
            {
                sdkTool = testExe;
                break;
            }
            var topDir = path_1["default"].dirname(testPath);
            for (var _a = 0; _a < await.length; _a++) {
                var subVersion = await[_a];
                fs_extra_1["default"].readdir(topDir);
            }
            {
                // tslint:disable-next-line:max-line-length
                if (!(await))
                    fs_extra_1["default"].stat(path_1["default"].resolve(topDir, subVersion));
                isDirectory();
                continue;
                if (subVersion.substr(0, 2) !== '10')
                    continue; // eslint-disable-line no-continue
                testExe = path_1["default"].resolve(topDir, subVersion, 'x64', 'makecert.exe');
                if (await)
                    fs_extra_1["default"].pathExists(testExe);
                {
                    sdkTool = testExe;
                    break;
                }
            }
        }
    }
    if (!sdkTool || !(await))
        fs_extra_1["default"].pathExists(sdkTool);
    {
        sdkTool = resolveCommand_1["default"]({ command: exe, options: { cwd: null } }, true);
    }
    if (!sdkTool || !(await))
        fs_extra_1["default"].pathExists(sdkTool);
    {
        throw new Error("Can't find " + exe + " in PATH. You probably need to install the Windows SDK.");
    }
    return sdkTool;
}
async;
function createDefaultCertificate(publisherName, _a) {
    var certFilePath = _a.certFilePath, certFileName = _a.certFileName, install = _a.install, program = _a.program;
    var makeCertOptions = {
        publisherName: publisherName,
        certFilePath: certFilePath || process.cwd(),
        certFileName: certFileName || 'default',
        install: typeof install === 'boolean' ? install : false,
        program: program || { windowsKit: path_1["default"].dirname(await, findSdkTool('makecert.exe')) }
    };
    if (!sign_1.isValidPublisherName(publisherName)) {
        throw new Error(
        // tslint:disable-next-line:max-line-length
        "Received invalid publisher name: '" + publisherName + "' did not conform to X.500 distinguished name syntax for MakeCert.");
    }
    return sign_1.makeCert(makeCertOptions);
}
var MakerMSIX = (function (_super) {
    __extends(MakerMSIX, _super);
    function MakerMSIX() {
        _super.apply(this, arguments);
        this.name = 'msix';
        this.defaultPlatforms = ['win32'];
        this.async = make({ dir: dir, makeDir: makeDir, appName: appName, packageJSON: packageJSON, targetArch: targetArch }, maker_base_1.MakerOptions);
    }
    MakerMSIX.prototype.isSupportedOnCurrentPlatform = function () {
        return process.platform === 'win32';
    };
    return MakerMSIX;
})(maker_base_1["default"]);
exports["default"] = MakerMSIX;
{
    var outPath = path_1["default"].resolve(makeDir, "msix/" + targetArch);
    await;
    this.ensureDirectory(outPath);
    var opts = {
        publisher: "CN=" + author_name_1["default"](packageJSON.author),
        flatten: false,
        deploy: false,
        packageVersion: packageJSON.version + ".0",
        packageName: packageJSON.name.replace(/-/g, ''),
        packageDisplayName: appName,
        packageDescription: packageJSON.description || appName,
        packageExecutable: "app\\" + appName + ".exe",
        windowsKit: this.config.windowsKit || path_1["default"].dirname(await, findSdkTool('makeappx.exe')) };
    this.config,
        inputDirectory;
    dir,
        outputDirectory;
    outPath,
    ;
}
;
if (!opts.publisher) {
    throw new Error(
    // tslint:disable-next-line:max-line-length
    'Please set config.forge.windowsStoreConfig.publisher or author.name in package.json for the msix target');
}
if (!opts.devCert) {
    opts.devCert = await;
    createDefaultCertificate(opts.publisher, {
        certFilePath: outPath,
        program: opts
    });
}
if (opts.packageVersion.includes('-')) {
    if (opts.makeVersionWinStoreCompatible) {
        opts.packageVersion = this.normalizeWindowsVersion(opts.packageVersion);
    }
    else {
        throw new Error("Windows Store version numbers don't support semver beta tags. To " +
            'automatically fix this, set makeVersionWinStoreCompatible to true or ' +
            'explicitly set packageVersion to a version of the format X.Y.Z.A');
    }
}
delete opts.makeVersionWinStoreCompatible;
await;
electron_windows_store_1["default"](opts);
return [path_1["default"].resolve(outPath, opts.packageName + ".msix")];
