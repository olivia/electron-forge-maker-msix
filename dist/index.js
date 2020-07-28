"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultCertificate = void 0;
const maker_base_1 = __importDefault(require("@electron-forge/maker-base"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const resolveCommand_1 = __importDefault(require("cross-spawn/lib/util/resolveCommand"));
const electron_windows_store_1 = __importDefault(require("electron-windows-store"));
const sign_1 = require("electron-windows-store/lib/sign");
const author_name_1 = __importDefault(require("./author-name"));
// NB: This is not a typo, we require AppXs to be built on 64-bit
// but if we're running in a 32-bit node.js process, we're going to
// be Wow64 redirected
const windowsSdkPaths = [
    'C:\\Program Files\\Windows Kits\\10\\bin\\x64',
    'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64',
];
async function findSdkTool(exe) {
    let sdkTool;
    for (const testPath of windowsSdkPaths) {
        if (await fs_extra_1.default.pathExists(testPath)) {
            let testExe = path_1.default.resolve(testPath, exe);
            if (await fs_extra_1.default.pathExists(testExe)) {
                sdkTool = testExe;
                break;
            }
            const topDir = path_1.default.dirname(testPath);
            for (const subVersion of await fs_extra_1.default.readdir(topDir)) {
                // tslint:disable-next-line:max-line-length
                if (!(await fs_extra_1.default.stat(path_1.default.resolve(topDir, subVersion))).isDirectory())
                    continue;
                if (subVersion.substr(0, 2) !== '10')
                    continue; // eslint-disable-line no-continue
                testExe = path_1.default.resolve(topDir, subVersion, 'x64', 'makecert.exe');
                if (await fs_extra_1.default.pathExists(testExe)) {
                    sdkTool = testExe;
                    break;
                }
            }
        }
    }
    if (!sdkTool || !(await fs_extra_1.default.pathExists(sdkTool))) {
        sdkTool = resolveCommand_1.default({ command: exe, options: { cwd: null } }, true);
    }
    if (!sdkTool || !(await fs_extra_1.default.pathExists(sdkTool))) {
        throw new Error(`Can't find ${exe} in PATH. You probably need to install the Windows SDK.`);
    }
    return sdkTool;
}
async function createDefaultCertificate(publisherName, { certFilePath, certFileName, install, program }) {
    const makeCertOptions = {
        publisherName,
        certFilePath: certFilePath || process.cwd(),
        certFileName: certFileName || 'default',
        install: typeof install === 'boolean' ? install : false,
        program: program || { windowsKit: path_1.default.dirname(await findSdkTool('makecert.exe')) },
    };
    if (!sign_1.isValidPublisherName(publisherName)) {
        throw new Error(
        // tslint:disable-next-line:max-line-length
        `Received invalid publisher name: '${publisherName}' did not conform to X.500 distinguished name syntax for MakeCert.`);
    }
    return sign_1.makeCert(makeCertOptions);
}
exports.createDefaultCertificate = createDefaultCertificate;
class MakerMSIX extends maker_base_1.default {
    constructor() {
        super(...arguments);
        this.name = 'msix';
        this.defaultPlatforms = ['win32'];
    }
    isSupportedOnCurrentPlatform() {
        return process.platform === 'win32';
    }
    ensureExternalBinariesExist() {
        return true;
    }
    async make({ dir, makeDir, appName, packageJSON, targetArch }) {
        const outPath = path_1.default.resolve(makeDir, `msix/${targetArch}`);
        await this.ensureDirectory(outPath);
        const opts = {
            publisher: `CN=${author_name_1.default(packageJSON.author)}`,
            flatten: false,
            deploy: false,
            packageVersion: `${packageJSON.version}.0`,
            packageName: packageJSON.name.replace(/-/g, ''),
            packageDisplayName: appName,
            packageDescription: packageJSON.description || appName,
            packageExecutable: `app\\${appName}.exe`,
            windowsKit: this.config.windowsKit || path_1.default.dirname(await findSdkTool('makeappx.exe')),
            ...this.config,
            inputDirectory: dir,
            outputDirectory: outPath,
        };
        if (!opts.publisher) {
            throw new Error(
            // tslint:disable-next-line:max-line-length
            'Please set config.forge.windowsStoreConfig.publisher or author.name in package.json for the msix target');
        }
        if (!opts.devCert) {
            opts.devCert = await createDefaultCertificate(opts.publisher, {
                certFilePath: outPath,
                program: opts,
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
        await electron_windows_store_1.default(opts);
        return [path_1.default.resolve(outPath, `${opts.packageName}.msix`)];
    }
}
exports.default = MakerMSIX;
//# sourceMappingURL=index.js.map