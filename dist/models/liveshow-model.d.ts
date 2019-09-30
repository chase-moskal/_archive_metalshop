import * as loading from "../toolbox/loading.js";
import { LiveshowGovernorTopic, User } from "authoritarian/dist/interfaces.js";
import { AuthPayload, PrivilegeLevel, VideoPayload } from "../interfaces.js";
export declare type HandleAuthUpdate = (auth: loading.Load<AuthPayload>) => Promise<void>;
/**
 * System-level liveshow state
 */
export declare class LiveshowModel {
    private liveshowGovernor;
    constructor(options: {
        liveshowGovernor: LiveshowGovernorTopic;
    });
    authLoadPubsub: import("authoritarian/dist/toolbox/pubsub").Pubsub<HandleAuthUpdate>;
    handleAuthLoad(authLoad: loading.Load<AuthPayload>): void;
    dispose(): void;
    makeViewModel: ({ videoName }: {
        videoName: string;
    }) => {
        dispose: () => void;
        viewModel: LiveshowViewModel;
    };
}
/**
 * Component-level liveshow state
 */
export declare class LiveshowViewModel {
    validationMessage: string;
    videoLoad: loading.Load<VideoPayload>;
    privilege: PrivilegeLevel;
    private videoName;
    private getAuthContext;
    private liveshowGovernor;
    constructor(options: {
        videoName: string;
        liveshowGovernor: LiveshowGovernorTopic;
    });
    ascertainPrivilege(user: User): PrivilegeLevel;
    handleAuthLoad(authLoad: loading.Load<AuthPayload>): Promise<void>;
    updateVideo(vimeostring: string): Promise<void>;
    private loadVideo;
}
