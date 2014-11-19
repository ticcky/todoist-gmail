top.TDOpts = {
    zIndex: 8,
    gmail_holder_left_pos: null,

    delayed_loading: true,
    collapsed: true,

    customPostion: function(holder) {
        var g_left_pos = TDOpts.gmail_holder_left_pos;
        if(g_left_pos) {
            holder.style.left = (g_left_pos - holder.offsetWidth - 5) + 'px';
        }
    },
    
    listen: function(evnt, elem, func) {
        if (elem.addEventListener) {
			elem.addEventListener(evnt, func, false);
		}
		else if (elem.attachEvent) { // IE DOM
			var r = elem.attachEvent("on"+evnt, func);
			return r;
		}
	}
};

(function() {
    function checkGmailHolder() {
        if(top.location.pathname.indexOf('/mail/') == -1 || window != top)
            return;
            
        // Check left pos of gmail holders (bottom right)
        var elms = document.querySelectorAll("div.no");
        for(var i=0; i < elms.length; i++) {
            var elm = elms[i];
            var css_text = elm && elm.style.cssText || '';
            if(elm && (css_text.indexOf("float: right") != -1 || elm.style.float == 'right')) {
                var left = null;
                if(elm.offsetWidth > 50) {
                    left = elm.offsetLeft;
                }
                if(TDOpts.gmail_holder_left_pos != left) {
                    TDOpts.gmail_holder_left_pos = left;
                    TDOpts.placeWindow();
                }
            }
        }

        // Check if we should add a button
        var buttons_holder = $(".nH .Cq div")[0];
        console.debug(buttons_holder);
        if(buttons_holder && !document.getElementById('TD_button')) {
            var span = document.createElement('span');
            span.innerHTML = '<div id="TD_button" data-eid="kdadialhpiikehpdeejjeiikopddkjem" class="T-I J-J5-Ji ar7 nf T-I-ax7 L3 td-button" data-tooltip="Add to Todoist" style="padding-left: 16px; padding-right: 16px;"><div aria-haspopup="true" style="-webkit-user-select: none; margin-bottom:0px;margin-top:-2px; outline: none;" role="button" class="J-J5-Ji W6eDmd L3 J-Zh-I J-J5-Ji Bq L3" tabindex="0"><img class="f tk3N6e-I-J3" src="https://d3ptyyxy2at9ui.cloudfront.net/949039a3107d0dc5e8fbc9bb9396c3db.png" style="vertical-align: -3px; height: 13px;"> <span class="td-button-text">Add</span> <div class="T-I-J3 J-J5-Ji">&nbsp;</div></div></div>';

            var div = span.firstChild;

            var reference = buttons_holder.firstChild.lastChild;

            if(reference) {
                buttons_holder.firstChild.insertBefore(div, reference);
            }
            else {
                buttons_holder.firstChild.appendChild(div);
            }

            div.addEventListener('click', function() {
                TDOpts.addAsTask();
                return false;
            }, false);
        }
    }

    setInterval(checkGmailHolder, 300);
})();
