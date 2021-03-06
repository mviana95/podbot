const audioconcat = require('audioconcat'),
      ffmpeg = require('fluent-ffmpeg'),
      config = require('./config')

class Audiobot {

    constructor(content) {
        this.content = content;
    }

    getSentences() {
        return this.content.sentences;
    }

    async init(increaseSpeed = true) {
        await this.mergeAudio();

        if (increaseSpeed) {
            await this.increaseSpeed();
        }

        return true;
    }

    async mergeAudio() {
        console.log('=>', 'Gerando o mp3 mergeado...');

        let assets = [config.intro];
        this.content.sentences.forEach(sentence => assets.push(`temp/${sentence.shortId}.mp3`));

        return await new Promise((resolve, reject) => {
            audioconcat(assets)
            .concat('temp/concat.mp3')
            .on('error', e => {
                console.log('[ERR] Concatenating', e) 
                reject(e)
            })
            .on('end', output => resolve(output))
        });
    }

    async increaseSpeed() {
        console.log('=>', 'Aumentando a velocidade...');

        return await ffmpeg('temp/concat.mp3')
                .audioFilters(['atempo=1.5','asetrate=44100*1/2'])
                .save(`result/${this.content.number}_audio.mp3`)
    }
}

module.exports = Audiobot;