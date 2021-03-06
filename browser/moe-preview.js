/*
 *  This file is part of Moeditor.
 *
 *  Copyright (c) 2016 Menci <huanghaorui301@gmail.com>
 *
 *  Moeditor is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Moeditor is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Moeditor. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

var updatePreview = false, updatePreviewRunning = false;
const MoeditorHighlight = require('./moe-highlight');

marked.setOptions({
    highlight: MoeditorHighlight
});

module.exports = function (cm, obj, cb) {
    function updateAsync() {
        updatePreview = false;
        updatePreviewRunning = true;

        const content = cm.getValue();
        w.moeditorWindow.content = content;
        // console.log(w.moeditorWindow.content);
        w.moeditorWindow.changed = true;
        var mathRenderer = new MoeditorMathRenderer(content);
        const replaced = mathRenderer.replace();
        const html = marked(replaced, function(err, val) {
            mathRenderer.render(val, function(val) {
                $('#previewer').html(val);
                cb();

                updatePreviewRunning = false;

                if (updatePreview) setTimeout(updateAsync, 0);
            });
        });
    }

    updatePreview = true;

    if (!updatePreviewRunning) {
        setTimeout(updateAsync, 0);
    }
}
