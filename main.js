var WorksItem = React.createClass({
    render: function() { 

        let elclass = (this.props.studio) ? 'workitem studio' : 'workitem';

        let screens = this.props.screen.map(function(value, i){
            return (
                <a key={i} href={value}>Макет</a>
            );
        });

        let groups = '["' + this.props.groups.join('","') + '"]';

        return (
            <li className={elclass} data-groups={groups} data-date-created={this.props.created} data-title={this.props.title}>
                <div className="item fade-in">
                  <img className="thumb" src={this.props.image} width="470" height="470" alt="" />
                  <div className="overlay">
                    <h3>{this.props.title}</h3>
                    <p className="comment" dangerouslySetInnerHTML={{__html: this.props.comment}}></p>
                    <p className="link"><a href={this.props.link} target="_blank">{this.props.link}</a></p>
                    <p className="screen">{screens}</p>
                    <p className="tag">{this.props.tag}</p>
                  </div>
                </div>
            </li>
        );
    }
});

var Works = React.createClass({
    getInitialState: function() {
        return {
            displayedWorks: []
        };
    },

    componentDidMount: function() {
        this.serverRequest = $.get(this.props.source, function (data) {
            this.setState({
                displayedWorks: data
            });
            afterMount();
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        return (
            <ul id="grid">
                {
                   this.state.displayedWorks.map(function(el) {
                        return <WorksItem
                            key={el.id}
                            title={el.title}
                            studio={el.studio}
                            image={el.image}
                            comment={el.comment}
                            groups={el.groups}
                            created={el.created}
                            screen={el.screen}
                            link={el.link}
                            tag={el.tag}
                        />;
                   })
                }
                <li className="workitem shuffle__sizer"></li>
            </ul>
        );
    }
});

if ( document.getElementById("works") ) ReactDOM.render(
    <Works source="/works/works.json" />,
    document.getElementById("works")
);


function afterMount() {

    /*if (window.location.href.indexOf('fullportfolio') > -1) {
      setCookie("fullportfolio", "1", 365, '/');     
    }*/

    //if (getCookie('fullportfolio') || (window.location.href.indexOf('fullportfolio') > -1)) {
      $('#works.hide').removeClass('hide');
    /*} else {
      $('#works.hide > ul > li.studio').remove();
    }*/

    $('.filter-options a').each(function(){
      var filter = $(this);
      var match = false;
      var tag = filter.attr('data-group');

      $('#works .workitem').each(function(){
        if ($(this).attr('data-groups')) { 
          var tags = JSON.parse($(this).attr('data-groups')); 
          for(var i = tags.length-1; i >= 0 ; i--) {
            if (tag == tags[i]) match = true;
          }
        }
      });

      if (!match) filter.remove();    

    });

    $('#works .item').each(function(i){

        // colorbox
        $(this).find('p.screen a').addClass('gal-'+i).attr('rel','gal-'+i);
        $('#works p.screen a.gal-'+i).colorbox({
            returnFocus: false, 
            rel: 'gal-'+i,
            opacity: .6
        });

        // count screens
        $(this).find('p.screen a:gt(0)').addClass('hide');
        var screenlink = $(this).find('p.screen a:eq(0)');
        if ($(this).find('p.screen a').length > 1) {
            screenlink.text( screenlink.text() + ' (' + $(this).find('p.screen a').length + ')');
        }

        // set date
        $(this).find('p.tag').text( $(this).find('p.tag').text() + ', ' + $(this).parent('.workitem').attr('data-date-created') );

    });


    var WorksShuffle = (function( $ ) {
      'use strict';

      var $grid = $('#grid'),
          $filterOptions = $('.filter-options'),
          $sizer = $grid.find('.shuffle__sizer'),

      init = function() {

        setTimeout(function() {
          setupFilters();
          setupSorting();
        }, 100);

        $grid.shuffle({
        itemSelector: '.workitem',
        sizer: $sizer,
        initialSort: {
            reverse: true,
            by: function($el) {
                return $el.data('date-created');
                }
            }
        });

        $('#content .options.hide').removeClass('hide');

      },

      setupFilters = function() {

        var $btns = $filterOptions.children();
        $btns.on('click', function() {
          var $this = $(this),
              isActive = $this.hasClass( 'active' ),
              group = isActive ? 'all' : $this.data('group');

          if ( !isActive ) {
            $('.filter-options .active').removeClass('active');
          }

          $this.toggleClass('active');

          $grid.shuffle( 'shuffle', group );
          return false;
        });

        $btns = null;

      },

      setupSorting = function() {
        $('.sort-options select').on('change', function() {

          var sort = this.value,
              opts = {};

          if ( sort === 'date-created-new' ) {
            opts = {
              reverse: true,
              by: function($el) {
                return $el.data('date-created');
              }
            };
          } else if ( sort === 'date-created-old' ) {
            opts = {
              reverse: false,
              by: function($el) {
                return $el.data('date-created');
              }
            };
          } else if ( sort === 'title' ) {
            opts = {
              by: function($el) {
                return $el.data('title');
              }
            };
          }

          $grid.shuffle('sort', opts);
        });
      }

      return {
        init: init
      };
    }( jQuery ));

    WorksShuffle.init();

}