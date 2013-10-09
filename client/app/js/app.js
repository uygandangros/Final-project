$(function() {

    var app = {
        init: function() {
            this.user = {};
            $('.menu-crud').addClass('hidden');
            $('.menu-user').addClass('hidden');
            $('.menu-loading').removeClass('hidden');
            $('.menu-user').addClass('hidden');
            $('.btn-login').addClass('hidden');

            $('.btn-login').attr('href', '/api/login?url=/');
            $('.btn-logout').attr('href','/api/logout?url=/');

            this.router = new Router();
            this.setEventListeners();
            this.getUser();

            Backbone.history.start({pushState: true});
        },

        setEventListeners: function() {
            var self = this;
            $('.menu-crud .item a').click(function(ev) {
                var $el = $(ev.target).closest('.item');

                $('.menu-crud .item').removeClass('active');
                $el.addClass("active");

                if ($el.hasClass('menu-list')) {
                    self.router.navigate('list', {trigger: true});
                }

                if ($el.hasClass('menu-create')) {
                    self.router.navigate('new', {trigger: true});
                }
            });

            $('.navbar-brand').click(function() {
                self.router.navigate('', {trigger: true});
            });
        },

        getUser: function() {
            var self = this;
            $.ajax({
                method: 'GET',
                url: '/api/users/me',
                success: function(me) {
                    // user is already signed in
                    console.log(me);
                    self.user = me;
                    self.showLogout();
                },

                error: function(err) {
                    console.log('you have not authenticated');
                    self.showLogin();
                }
            });
        },
        
		showLogin: function() {
           $('.menu-loading').addClass('hidden');
           $('.menu-user').addClass('hidden');
           $('.btn-login').removeClass('hidden');
        },
        
		showLogout: function() {
           $('.menu-crud').removeClass('hidden');
           $('.user-email').text(this.user.email);
           $('.menu-loading').addClass('hidden');
           $('.btn-login').addClass('hidden');
           $('.menu-user').removeClass('hidden');
        },
        
		showHome: function() {
            $('.app-content').html('');
        },
        
		showList: function() {
            var $listTemplate = getTemplate('tpl-thesis-list');
            $('.app-content').html($listTemplate);
            this.loadAllThesis();
			
        },
        
		showForm: function(object) {
            if (!object) {
                object = {};
            }
            var self = this;
            var $formTemplate = getTemplate('tpl-thesis-form', object);
            $('.app-content').html($formTemplate);


            $('form').unbind('submit').submit(function(ev) {
                var thesisObject = {};
                var inputs = $('form').serializeArray();
                for (var i = 0; i < inputs.length; i++) {
                    thesisObject[inputs[i].name] = inputs[i].value;
                }
                self.save(thesisObject);
                return false;
            });

        },
       
	   loadAllThesis: function() {
            $.get('/api/thesis', this.displayLoadedList);
        },
       
	   displayLoadedList: function(list) {
            console.log('response', list);
            //  use tpl-thesis-list-item to render each loaded list and attach it
			for (var i = 0; i < list.length; i++){
				$('.thesis-list').append(getTemplate('tpl-thesis-list-item', list[i]));
			}
		$(document).ready(function() {	
			$('tr').click(function() { 
			app.router.navigate('thesis-' + $(this).attr('data-id'), {trigger: true});
				$('.detail-container').empty();
					var data;
						for( var i = 0; i < list.length; i++){
							if($(this).attr('data-id') == list[i].Id){
								data = i;
							}
						}
				$('.detail-container').append(getTemplate('thesis-detail', list[data]));
				fbcomment(document, 'script', 'facebook-jssdk');
			});
		});
			
        },
		
        save: function(object) {
            var self = this;
			$.post('/api/thesis', object);
			alert("Saved");
        }
    };

	
    function getTemplate(template_id, context) {
        var template, $template, markup;
        template = $('#' + template_id);
        $template = Handlebars.compile(template.html());
        markup = $template(context);
        return markup;
    }
	
	function fbcomment(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=576298592434566";
		  fjs.parentNode.insertBefore(js, fjs);
		};

    var Router = Backbone.Router.extend({
        routes: {
            '': 'onHome',
            'thesis-:id': 'onView',
            'new': 'onCreate',
            'edit': 'onEdit',
            'list': 'onList'
        },

       onHome: function() {
            app.showHome();
       },

       onView: function(id) {
		   console.log('thesis id', id);
       },

       onCreate: function() {
            app.showForm();
       },

       onEdit: function() {

       },

       onList: function() {
            app.showList();
       }

    });
    app.init();
	

});