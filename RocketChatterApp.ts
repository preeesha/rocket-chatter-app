import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";

import { DocumentCommand } from "./commands/DocumentCommand";
import { HealthCommand } from "./commands/HealthCommand";
import { ImportanceCommand } from "./commands/ImportanceCommand";
import { SearchUsageCommand } from "./commands/SearchUsageCommand";
import { SummarizeCommand } from "./commands/SummarizeCommand";
import { TranslateCommand } from "./commands/TranslateCommand";

export class RocketChatterApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.slashCommands.provideSlashCommand(new HealthCommand());

        configuration.slashCommands.provideSlashCommand(
            new SearchUsageCommand()
        );
        configuration.slashCommands.provideSlashCommand(new SummarizeCommand());
        configuration.slashCommands.provideSlashCommand(new TranslateCommand());
        configuration.slashCommands.provideSlashCommand(new DocumentCommand());
        configuration.slashCommands.provideSlashCommand(
            new ImportanceCommand()
        );
    }
}
