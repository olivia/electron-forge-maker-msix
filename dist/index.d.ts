import MakerBase, { MakerOptions } from '@electron-forge/maker-base';
import { ForgePlatform } from '@electron-forge/shared-types';
import { MakerMSIXConfig } from './config';
export interface CreateDefaultCertOpts {
    certFilePath?: string;
    certFileName?: string;
    program?: MakerMSIXConfig;
    install?: boolean;
}
export declare function createDefaultCertificate(publisherName: string, { certFilePath, certFileName, install, program }: CreateDefaultCertOpts): Promise<any>;
export default class MakerMSIX extends MakerBase<MakerMSIXConfig> {
    name: string;
    defaultPlatforms: ForgePlatform[];
    isSupportedOnCurrentPlatform(): boolean;
    ensureExternalBinariesExist(): boolean;
    make({ dir, makeDir, appName, packageJSON, targetArch }: MakerOptions): Promise<any[]>;
}
