(function() {
    if(top.location.pathname.indexOf('/mail/') == -1)
        return;

    var TD_OPTS = top.TDOpts || {};
    var ANY_OPTS = {};

	var doc = top.document;

    //
    // --- Toggle ---
    //
	var cur_elm = doc.getElementById('todoist_holder');
	if(cur_elm && cur_elm.style.display != 'none') {
		cur_elm.style.display = 'none';
		return true;
	}
	else if(cur_elm) {
		cur_elm.style.display = 'block';
		return true;
	}

    //
    // --- Create ---
    //
	var domain = 'gmail.todoist.com';

	// --- Helpers
    function getWindowSize(doc) {
        doc = doc || top.document;
        var win_w, win_h;
        if (self.innerHeight) {
            win_w = self.innerWidth;
            win_h = self.innerHeight;
        } else if (doc.documentElement && doc.documentElement.clientHeight) {
            win_w = doc.documentElement.clientWidth;
            win_h = doc.documentElement.clientHeight;
        } else if (doc.body) {
            win_w = doc.body.clientWidth;
            win_h = doc.body.clientHeight;
        }
        return {'w': win_w, 'h': win_h};
    }

    // Create icon
    function createIcon(top_pos, click_fn) {
        var img = doc.createElement('img');

        img.src = 'https://d3ptyyxy2at9ui.cloudfront.net/76084e29cb2cf72b320e888edc583dfb.gif';
        img.width = 24;
        img.height = 24;
        img.style.background = 'transparent url(https://d3ptyyxy2at9ui.cloudfront.net/b31d4a5cca4583afd2b2dae80aac056a.png) 0 0 no-repeat';
        img.style.backgroundPosition = '0 ' + top_pos + 'px';
        img.style.opacity = '0.5';
        img.style.marginLeft = '5px';

        listen('mouseover', img, function() {
            img.style.opacity = '1.0';
            img.style.backgroundColor = '#737373';
        });

        listen('mouseout', img, function() {
            img.style.opacity = '0.5';
            img.style.backgroundColor = 'transparent';
        });

        if(click_fn)
            listen('click', img, click_fn);

        return img;
    }

    function postMessageToWindow(win, message) {
        try {
            win.postMessage(message, '*');
            return true;
        }
        catch(e) {
            return false;
        }
    }

    function getScrollTop() {
        var t;
        if (doc.documentElement && doc.documentElement.scrollTop)
                t = doc.documentElement.scrollTop;
        else if (doc.body)
                t = doc.body.scrollTop;
        return t;
    }

	function listen(evnt, elem, func) {
		if (elem.addEventListener) {
			elem.addEventListener(evnt, func, false);
		}
		else if (elem.attachEvent) { // IE DOM
			var r = elem.attachEvent("on"+evnt, func);
			return r;
		}
	}

    // --- Icon functions
    function closeWindow() {
        setTimeout(function() {
            doc.getElementById('todoist_holder').style.display = 'none';

            if(TD_OPTS.onCloseWindow)
                TD_OPTS.onCloseWindow();
        }, 50);
        return false;
    }

    function collapseWindow() {
        if(ANY_OPTS.timeout_collapse) {
            clearTimeout(ANY_OPTS.timeout_collapse);
            ANY_OPTS.timeout_collapse = null;
        }

		if(holder.collapsed) {
			iframe.style.display = 'block';
			holder.collapsed = false;
			placeWindow();
		}
		else {
			iframe.style.display = 'none';
			holder.collapsed = true;
			placeWindow();
		}

        if(collapse_icon && holder.collapsed)
            collapse_icon.style.backgroundPosition = '0 -24px';
        else
            collapse_icon.style.backgroundPosition = '0 -48px';
    }

    TD_OPTS.collapseWindow = collapseWindow;


	// Create holder
	var holder = doc.createElement('div');
	holder.id = 'todoist_holder';
	holder.style.position = "fixed";
	holder.style.backgroundColor = '#fff';
	holder.style.border = "1px solid #ccc";
	holder.style.fontFamily = "sans-serif";
	holder.style.fontSize = "12px";
	holder.style.zIndex = TD_OPTS.zIndex || 134343443;

    TD_OPTS.holder = holder;

	//Create the top
	var top_frame = doc.createElement('div');
	top_frame.style.color = "#fff";
	top_frame.style.padding = "2px";
	top_frame.style.padding = "10px";
	top_frame.style.paddingLeft = "14px";
	top_frame.style.paddingRight = "8px";
	top_frame.style.backgroundColor = "#404040";
	top_frame.style.cursor = "pointer";
	top_frame.style.textAlign = "left";
	top_frame.style.fontSize = "13px";

    // Icons holder
    var icons_holder = doc.createElement('div');
    icons_holder.style.cssText = 'margin-top: -5x; float: right; text-align: right; width: 90px;';
    icons_holder.style.marginTop = '-5px';
    icons_holder.style.float = 'right';
    icons_holder.style.textAlign = 'right';
    icons_holder.style.width = '90px';

    var collapse_icon;

    if(TD_OPTS.collapsed)
        icons_holder.appendChild(collapse_icon=createIcon(-24, collapseWindow));
    else
        icons_holder.appendChild(collapse_icon=createIcon(-48, collapseWindow));

    if(TD_OPTS.hide_close_icon != true)
        icons_holder.appendChild(createIcon(0, closeWindow));

    top_frame.appendChild(icons_holder);

	top_frame.appendChild(doc.createTextNode('Todoist'));

    // Iframe
	var iframe = doc.createElement('iframe');

	//Place the element in the right
	function placeWindow() {
		var win_size = getWindowSize();

        var width = 400;
        var height = 600;

        if(win_size.h > 800)
            height = 650;

        if(win_size.h < 800)
            height = 520;

        if(win_size.w > 800)
            width = 500;

        if(win_size.w < 1300)
            width = 410;

        if(holder.collapsed) {
            holder.style.width = '275px';
        }
        else {
            holder.style.width = width + 'px';
            iframe.style.width = width + 'px';
        }

		iframe.height = height - top_frame.offsetHeight;

        holder.style.bottom = '-1px';
		holder.style.left = (win_size.w - holder.offsetWidth - 30) + 'px';

        if(TD_OPTS.customPostion) {
            TD_OPTS.customPostion(holder);
        }
	}

    TD_OPTS.placeWindow = placeWindow;

    // Click fn
	listen('click', top_frame, function(ev) {
        var elm = ev.srcElement || ev.target;

        if(elm && elm.nodeName.toLowerCase() == 'img')
            return true; 
	    
        collapseWindow();
	});

	holder.appendChild(top_frame);


	// Crate the iframe
	iframe.src = 'https://'+domain+'/app?mini=1';
	iframe.id = 'todoist_iframe';
	iframe.frameBorder = 0;
	iframe.border = 0;
	iframe.style.margin = '0px';
	iframe.style.padding = '0px';
	holder.appendChild(iframe);

	var body = doc.getElementsByTagName('body')[0];

	holder.style.visibility = 'hidden';

	body.appendChild(holder);

	listen('scroll', window, placeWindow);
	listen('resize', window, placeWindow);

	placeWindow();

    if(TD_OPTS.delayed_loading) {
        holder.style.visibility = 'hidden';
        ANY_OPTS.timeout_collapse = setTimeout(function() {
            holder.style.visibility = 'visible';
            if(!holder.collapsed)
                collapseWindow();
        }, 1000);
    }
    else {
        holder.style.visibility = 'visible';
    }

	var CUR_HREF = null;

    var baseUrl = "https://mail.google.com/mail/u/0/#all/";

    function locationPasser() {
        var cls = document.getElementsByClassName("ii gt adP adO")[0].getAttribute('class');
        var mId = cls.match(/ m([a-zA-Z0-9]+) /)[1];
        console.debug("CURR MSG: " + mId);
        console.debug("CURR MSG: " + CUR_HREF);
        // if(mId !== CUR_HREF) 
        {
            CUR_HREF = mId;

            var data_to_send = baseUrl + mId + '--/--' + 'Email';
            var succ = postMessageToWindow(iframe.contentWindow, data_to_send);
        }
    }
    setInterval(locationPasser, 200);

    top.addEventListener('message', function(e) {
        var str_data = e.data;
        if(str_data && str_data.indexOf('SWITCH_URL:') != -1) {
            str_data = str_data.replace('SWITCH_URL:', '');
            top.location = str_data;
        };
    });

    // Quick add
    TD_OPTS.addAsTask = function() {
        if(holder.style.display == 'none') {
            holder.style.display = 'block';
        }

        if(holder.collapsed) {
            collapseWindow();
            placeWindow();
        }

        var msg = {
            'msg_type': 'GMAIL_MESSAGE_ADD',
            'title': ''+top.document.title,
            'href': ''+top.location.toString()
        };

        postMessageToWindow(iframe.contentWindow, JSON.stringify(msg));
    }
})();
