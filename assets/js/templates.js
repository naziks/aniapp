const create_article_post = (options = {id:null, title:null, image:null, type:null, duration:null, tags:null, description:null}) => {
    options.tags = options.tags.map(function(a){return "<li>"+a+"</li>"}).join("\n")
    let r = ''
    +'<article type="search" xmlns="http://www.w3.org/1999/xhtml">'
    +   '<h1 onclick="router.navigate(\'/anime/'+options.id+'\')" class="title">'
    +       '<span>$ANIME_TITLE$</span>'
    +   '</h1>'
    +   '<img src="$IMAGE$" alt="Poster" onclick="router.navigate(\'/anime/'+options.id+'\')" />'
    +   '<main class="text">'
    +       '<p>'
    +           '<strong>Type:&nbsp;</strong>'
    +           '<span>$TYPE$</span>'
    +       '</p>'
    +       '<p>'
    +           '<strong>Duration:&nbsp;</strong>'
    +           '<span>$DURATION$</span>'
    +       '</p>'
    +       '<div class="tags">'
    +           '<strong>Tags:&nbsp;</strong>'
    +           '<ul>$TAGS$</ul>'
    +       '</div>'
    +       '<p class="description">'
    +           '<strong>Description:&nbsp;</strong>'
    +           '<span>$DESCRIPTION$</span>'
    +       '</p>'
    +   '</main>'
    +'</article>'
    return r.replace('$ANIME_TITLE$', options.title.split(" / ")[0])
    .replace('$IMAGE$', options.image)
    .replace('$TYPE$', options.type)
    .replace('$DURATION$', options.duration)
    .replace('$TAGS$', options.tags)
    .replace('$DESCRIPTION$', trim_text(options.description)+"...");
}

const create_full_article = (options = {id:null, title:null, urlImagePreview:null, type:null, duration:"?", tags:null, description:null}) => {
    options.genre = options.genre.map(function(a){return "<li>"+a+"</li>"}).join("\n")
    options.series_list = options.series.map(function(a){
        return "<option value=\""+a.id+"\">"+a.title+"</option>"
    }).join("\n");
    let r = ''
    +'<article type="post" xmlns="http://www.w3.org/1999/xhtml">'
    +   '<h2 class="title">'
    +       '<span>%TITLE%</span>'
    +   '</h2>'
    +   '<div class="poster">'
    +       '<img src="%POSTER%" data-src="%POSTER_SRC%" alt="Poster" />'
    +   '</div>'
    +   '<main class="text">'
    +       '<div class="director">'
    +           '<strong>Director:&nbsp;</strong>'
    +           '<span>%DIRECTOR%</span>'
    +       '</div>'
    +       '<div class="year">'
    +           '<strong>Year:&nbsp;</strong>'
    +           '<span>%YEAR%</span>'
    +       '</div>'
    +       '<div class="type">'
    +           '<strong>Type:&nbsp;</strong>'
    +           '<span>%TYPE%</span>'
    +       '</div>'
    +       '<div class="duration">'
    +           '<strong>Duration:&nbsp;</strong>'
    +           '<span>%DURATION%</span>'
    +       '</div>'
    +       '<div class="genre">'
    +           '<strong>Genres:&nbsp;</strong>'
    +           '<ul>%TAGS%</ul>'
    +       '</div>'
    +       '<p class="description" itemProp="description">'
    +           '<strong>Description:&nbsp;</strong>'
    +           '<span>%DESCRIPTION%</span>'
    +       '</p>'
    +   '</main>'
    +   '<div class="player">'
    +       '<div class="continue-button container">'
    +           '<span>Continue from <b class="continue-button-value">00:00</b></span>'
    +       '</div>'
    +       '<select onchange="set_seria(this.value, this.selectedOptions[0].innerText)">'
    +           '%PLAYER%'
    +       '</select>'
    +       '<video poster="./assets/img/placeholder.png" class="vidplayer" crossOrigin="anonymous" crossorigin="anonymous" controls />'
    +   '</div>'
    +'</article>';
    return {
        data:r.replace('%TITLE%', options.title.split(" / ")[0])
        .replace('%POSTER%', options.urlImagePreview)
        .replace('%POSTER_SRC%', options.urlImagePreview)
        .replace('%TYPE%', options.type)
        .replace('%DIRECTOR%', options.director)
        .replace('%DURATION%', options.duration)
        .replace('%TAGS%', options.genre)
        .replace('%YEAR%', options.year)
        .replace('%DESCRIPTION%', options.description)
        .replace('%PLAYER%', options.series_list),
        cb: function(options){
            init_player(options.series);
            if(!mobileAndTabletcheck())
                $('select').niceSelect();
        }
    }
}

const create_player_article = (options = {id:null, title:null, urlImagePreview:null, type:null, duration:"?", tags:null, description:null}) => {
    options.series_list = options.series.map(function(a){
        return "<option value=\""+a.id+"\">"+a.title+"</option>"
    }).join("\n");

    let r = ''
    +'<article type="player" xmlns="http://www.w3.org/1999/xhtml">'
    +   '<div class="player player-fullscreen">'
    +       '<select onchange="set_seria(this.value, this.innerHTML)">'
    +           '%PLAYER%'
    +       '</select>'
    +       '<video poster="./assets/img/placeholder.png" class="vidplayer" crossOrigin="anonymous" crossorigin="anonymous" controls />'
    +   '</div>'
    +'</article>';
    return {
        data:r.replace('%PLAYER%', options.series_list),
        cb: function(options){
            init_player(options.series);
            if(!mobileAndTabletcheck())
                $('select').niceSelect();
        }
    }
}

const create_pagination = (path = "/news/page/", current_page = 1, pages = 1) => {
    let btn1 = 'onclick="router.navigate(\''+path + (current_page - 1)+'\')"';
    if(current_page - 1 < 1){
        btn1 = "disabled=\"disabled\"";
    }

    let btn2 = 'onclick="router.navigate(\''+path+(current_page+1)+'\')"';
    if(current_page + 1 > pages){
        btn2 = "disabled=\"disabled\"";
    }

    return ''
    +'<div class="pagination">'
    +   '<button '+btn1+'>'
    +       'Prev'
    +   '</button>'
    +   '<button>'
    +       current_page + ' / ' + pages
    +   '</button>'
    +   '<button '+btn2+'>'
    +       'Next'
    +   '</button>'
    +'</div>';
}
