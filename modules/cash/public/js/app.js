require.config({
	baseUrl: "/common/js",
	paths: {
		"hbs": _prefix+"/hbs",
		"cash": _prefix+"/js",
		"jquery": "jquery",		
		"jquery-form": "/common/js/jquery.form",		
		"jquery-ui": "/common/js/jquery-ui-1.10.1.custom.min",
		"jquery-block": "/common/js/jquery.blockUI",			
		"bootstrap": "/common/js/bootstrap.min",
		"highcharts": "/common/js/highcharts/highcharts",
		"skigrid": _prefix+"/js/jquery.skiGrid",
		"bootstrap-datepicker": "/common/js/locales/bootstrap-datepicker."+_user.language.charAt(0)+_user.language.charAt(1),
		"bootstrap-datepicker-core": "/common/js/bootstrap-datepicker",
		"jquery-mousewheel": _prefix+"/js/jquery.mousewheel",
		"bootstrap-typeahead": "/common/js/bootstrap-typeahead"
	},
	shim:{
		"gettext": {
			exports: "Gettext",
			init: function () {
				delete this.Getext;
			}
		},
		"highcharts": {
			deps:["jquery"]
		},		
		"bootstrap": {
			deps:["jquery"]
		},
		"jquery-form": {
			deps:["jquery"]
		},		
		"jquery-block": {
			deps:["jquery"]
		},
		"jquery-ui": {
		   deps:["jquery"]
		},
		"skigrid": {
			deps:["jquery"]
		},
		"bootstrap-datepicker-core": {
			deps:["jquery","bootstrap"]
		},
		"bootstrap-datepicker": {
			deps:["bootstrap-datepicker-core"]
		},
		"bootstrap-typeahead": {
			deps:["bootstrap","lodash"]
		},		
		"jquery-mousewheel":{
			deps:["jquery"]
		}
	},
	config: {
        'clitpl': {
            mPath: '/cash/',
            mName: 'cash'
        }
    }
});

define("api", function () {
	return {
		call:function () {
			var la = Array.prototype.slice.call(arguments);
			la.splice(1,0,_apiToken);
			var cb = la[la.length-1];
			la[la.length-1] = {
				success: function (data) {
					data.splice(0,0,null);
					cb.apply(this,data);
				},
				failure: cb
			}
			require(['jsonrpc'], function (JsonRpc) {
				var rpc = new JsonRpc('/jsonrpc');
				rpc.call.apply(rpc, la)
			},cb)
		},
		batch:function (batch,cb) {
			require(['lodash','jsonrpc'], function (_,JsonRpc) {
				_.forEach(batch, function (s) {
					if (s.cmd == "api")
						s.prm.splice(1,0,_apiToken)
				})
				var rpc = new JsonRpc('/jsonrpc');
				rpc.call("batch.runBatch",batch,{
					success: function (data) {
						data.splice(0,0,null);
						cb.apply(this,data);
					},
					failure: cb
				})
			},cb)
		}
	}
})

function appError(err,title) {
	if (err) {
		require(["jquery","bootstrap"], function ($) {
			var message = "Unknown error";
			if (err.message)
				message = err.message;
			if (err.data && err.data.subject)
				message+=" ("+err.data.subject + ")"
			if (err.requireModules)
				message+="<br>"+ err.requireType + " modules: "+JSON.stringify(err.requireModules);
			var t = title || "Ops, something weird happened !";
			var $ctx = $(".context");
			if ($('.modal').is(':visible'))
				$ctx = $('.modal');
			if ($('.localctx').is(':visible'))
				$ctx = $('.localctx');

			$ctx.prepend('<div class="alert alert-error"><button class="close" data-dismiss="alert">×</button><strong>'+t+'</strong><br>'+message+'</div>').alert();
		})
	}
}

require(["jquery","bootstrap"],function () {})
