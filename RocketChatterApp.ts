import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";

import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";
import { ExplainCommand } from "./commands/ExplainCommand";

export class RocketChatterApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.slashCommands.provideSlashCommand(new ExplainCommand());
    }
}
