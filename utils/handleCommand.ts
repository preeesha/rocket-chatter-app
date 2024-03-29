import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export async function handleCommand(
    context: SlashCommandContext,
    modify: IModify,
    command: string
) {
    const args = context.getArguments();
    const user = modify
        .getCreator()
        .startBotUser({
            name: "Rocket Chatter",
            username: "rocket.chatter",
            bio: "Rcoket Chatter",
        })
        .getUser() as IUser;

    console.log("```\n" + `/${command} ${args.join(" ")}` + "\n```");
    const greetMessage = modify.getCreator().startMessage();
    greetMessage
        .setSender(user)
        .setRoom(context.getRoom())
        .setGroupable(false)
        .setText("```\n" + `/${command} ${args.join(" ")}` + "\n```");
    await modify.getCreator().finish(greetMessage);

    const progressIndicators = [
        ":hammer:",
        ":hammer_pick:",
        ":tools:",
        ":pick:",
    ];

    const builder = modify.getCreator().startMessage();
    builder
        .setSender(user)
        .setRoom(context.getRoom())
        .setText(":pick: Working");
    const message = await modify.getCreator().finish(builder);

    let progressCount = 0;
    const progressIndicatorInterval = setInterval(async () => {
        if (progressCount === progressIndicators.length) progressCount = 0;

        const updater = await modify.getUpdater().message(message, user);
        updater
            .setEditor(user)
            .setRoom(context.getRoom())
            .setText(`${progressIndicators[progressCount++]} Working`);
        await modify.getUpdater().finish(updater);
    }, 500);

    return async (newMessage: string, imageAttachments: string[] = []) => {
        clearInterval(progressIndicatorInterval);

        const updater = await modify.getUpdater().message(message, user);
        updater
            .setEditor(user)
            .setRoom(context.getRoom())
            .setText(newMessage)
            .setAttachments(imageAttachments.map((x) => ({ imageUrl: x })));
        await modify.getUpdater().finish(updater);
    };
}
