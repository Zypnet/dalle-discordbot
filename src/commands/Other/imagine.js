const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagine")
        .setDescription("Send a prompt to generate images")
        .addStringOption(option => option.setName('prompt').setDescription('Prompt to generate image').setRequired(true))
        .addStringOption(option =>
            option.setName('size')
                .setDescription('Set image size (default: 1024x1024)')
                .setRequired(false)
                .addChoices(
                    {
                        name: "1024x1024",
                        value: "1024x1024"
                    },
                    {
                        name: "512x512",
                        value: "512x512"
                    },
                    {
                        name: "256x256",
                        value: "256x256"
                    },
                )),
    async execute(interaction) {
        const prompt = interaction.options.getString('prompt');
        const size = interaction.options.getString('size') ?? "1024x1024";

        await interaction.deferReply();

        try {
            const response = await openai.createImage({
                prompt: prompt,
                size: size,
            });

            // console.log(response.data.data[0].url)

            const embed = new EmbedBuilder()
                .setTitle("DALL-E")
                .setDescription(prompt)
                .setImage(response.data.data[0].url)
                .setTimestamp()

            
            await interaction.editReply({
                embeds: [embed]
            });



        } catch (error) {

            console.log(error)
            await interaction.reply({
                content: "There was an error while generating the image",
                ephemeral: true
            })

        }

    }
}