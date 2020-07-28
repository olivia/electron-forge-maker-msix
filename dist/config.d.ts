export interface MakerMSIXConfig {
    containerVirtualization?: boolean;
    flatten?: boolean;
    packageVersion?: string;
    packageName?: string;
    packageDisplayName?: string;
    packageDescription?: string;
    packageExecutable?: string;
    assets?: string;
    manifest?: string;
    deploy?: boolean;
    publisher?: string;
    windowsKit?: string;
    devCert?: string;
    certPass?: string;
    desktopConverter?: string;
    expandedBaseImage?: string;
    makeappxParams?: string[];
    signtoolParams?: string[];
    makePri?: boolean;
    createConfigParams?: string[];
    createPriParams?: string[];
    finalSay?: () => Promise<void>;
    makeVersionWinStoreCompatible?: boolean;
}
