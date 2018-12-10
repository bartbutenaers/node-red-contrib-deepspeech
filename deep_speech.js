/**
 * Copyright 2018 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 module.exports = function(RED) {
    var settings = RED.settings;
    var deepSpeech = require('deepspeech');
    const argparse = require('argparse');
    const util = require('util');
    
    function totalTime(hrtimeValue) {
        return parseFloat((hrtimeValue[0] + hrtimeValue[1] / 1000000000).toPrecision(4));
    }

    function DeepSpeechNode(config) {
        RED.nodes.createNode(this, config);
        this.modelPath = config.modelPath || '/home/pi/node_modules/deepspeech/models';
        
        debugger;
 
        var node = this;
        
        // These constants control the beam search decoder

        // Beam width used in the CTC decoder when building candidate transcriptions
        const BEAM_WIDTH = 500;

        // The alpha hyperparameter of the CTC decoder. Language Model weight
        const LM_WEIGHT = 1.50;

        // Valid word insertion weight. This is used to lessen the word insertion penalty
        // when the inserted word is part of the vocabulary
        const VALID_WORD_COUNT_WEIGHT = 2.10;

        // These constants are tied to the shape of the graph used (changing them changes
        // the geometry of the first layer), so make sure you use the same constants that
        // were used during training

        // Number of MFCC features to use
        const N_FEATURES = 26;

        // Size of the context window used for producing timesteps in the input vector
        const N_CONTEXT = 9;

        deepSpeech.printVersions();
        
        // Load the english model (file) once
        if (!node.model) {
            console.info('Loading model from file %s', node.modelPath);
        
            const model_load_start = process.hrtime();
        
            // TODO load model once for all nodes
            node.model = new deepSpeech.Model(node.modelPath + '/output_graph.pbmm', N_FEATURES, N_CONTEXT, node.modelPath + '/alphabet.txt', BEAM_WIDTH);
        
            const model_load_end = process.hrtime(model_load_start);
            console.info('Loaded model in %ds.', totalTime(model_load_end));

        /*  if (args['lm'] && args['trie']) {
            console.error('Loading language model from files %s %s', args['lm'], args['trie']);
            const lm_load_start = process.hrtime();
            model.enableDecoderWithLM(args['alphabet'], args['lm'], args['trie'],
                                      LM_WEIGHT, VALID_WORD_COUNT_WEIGHT);
            const lm_load_end = process.hrtime(lm_load_start);
            console.error('Loaded language model in %ds.', totalTime(lm_load_end));
          }*/
        }
        
        node.on("input", function(msg) {
            // Skip all messages until the model has been loaded
            if (!node.model) {
                return;
            }
            
          //  debugger;
          //  var speechAsText = node.model.stt(msg.payload, 16000);
                      
          // We take half of the buffer_size because buffer is a char* while
          // LocalDsSTT() expected a short*
          /*
          console.log(model.stt(audioBuffer.slice(0, audioBuffer.length / 2), 16000));
          const inference_stop = process.hrtime(inference_start);
          console.error('Inference took %ds for %ds audio file.', totalTime(inference_stop), audioLength.toPrecision(4));
          */

            node.send( {payload:speechAsText} );
        });
    }

    RED.nodes.registerType("deep-speech",DeepSpeechNode);
}
