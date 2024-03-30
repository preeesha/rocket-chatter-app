import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { App } from "@rocket.chat/apps-engine/definition/App";
import { IAppInfo } from "@rocket.chat/apps-engine/definition/metadata";

import {
    IUIKitResponse,
    UIKitBlockInteractionContext,
    UIKitViewSubmitInteractionContext,
} from "@rocket.chat/apps-engine/definition/uikit";
import { AskCommand } from "./commands/AskCommand";
import { DiagramCommand } from "./commands/DiagramCommand";
import { DocumentCommand } from "./commands/DocumentCommand";
import { HealthCommand } from "./commands/HealthCommand";
import { ImportanceCommand } from "./commands/ImportanceCommand";
import { SuggestCommand } from "./commands/SuggestCommand";
import { TranslateCommand } from "./commands/TranslateCommand";
import { WhyUsedCommand } from "./commands/WhyUsedCommand";
import { handleModalViewOpen } from "./utils/handleModalViewOpen";
import { handleModalViewSubmit } from "./utils/handleModalViewSubmit";

export class RocketChatterApp extends App {
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
    }

    public async executeBlockActionHandler(
        context: UIKitBlockInteractionContext
    ): Promise<IUIKitResponse> {
        return await handleModalViewOpen(context);
    }

    public async executeViewSubmitHandler(
        context: UIKitViewSubmitInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ) {
        handleModalViewSubmit(context, read, http, modify);
    }

    public async extendConfiguration(configuration: IConfigurationExtend) {
        configuration.slashCommands.provideSlashCommand(new HealthCommand());
        configuration.slashCommands.provideSlashCommand(new AskCommand());
        configuration.slashCommands.provideSlashCommand(new DiagramCommand());
        configuration.slashCommands.provideSlashCommand(new WhyUsedCommand());
        configuration.slashCommands.provideSlashCommand(new TranslateCommand());
        configuration.slashCommands.provideSlashCommand(new DocumentCommand());
        configuration.slashCommands.provideSlashCommand(
            new ImportanceCommand()
        );
        configuration.slashCommands.provideSlashCommand(new SuggestCommand());
    }
}
