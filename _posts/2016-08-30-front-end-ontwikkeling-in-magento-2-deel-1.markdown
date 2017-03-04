---
layout: post
title:  "Front-end ontwikkeling in Magento 2: Deel #1"
date:   2016-8-30 21:32:18 +0200
categories: jekyll update
thumbnail: "/media/post/camera.jpg"
---

Magento 2 is alweer een tijdje geleden uitgekomen, in november 2015 om precies te zijn. Nu is het tijd dat we echt beginnen te bouwen. Voor Magento 2 heb je namelijk veel meer nodig dan alleen een Magento installatie en een webserver om te starten, zoals bij Magento 1 het geval was. Voor Magento 2 hebben we een veel geavanceerdere ontwikkelomgeving nodig met een lokale Nginx server, Front-end tools, build en test server etc.

In een paar delen ga ikover het ontwikkelen in Magento 2 schrijven, plus alles wat daar mee te maken heeft. Aangezien ik een Front-End Developer ben zullen deze blogposts voornamelijk gericht zijn op de Front-End ontwikkeling van Magento 2  ;-). Deze post is dan ook geschreven voor Magento 2 ontwikkelaars en ik ga er vanuit dat je basis kennis hebt van Magento en Front-End.

### Grunt vs. Gulp en LESS vs. SASS

Over Grunt vs. Gulp en LESS vs. SASS is de afgelopen jaren al veel discussie geweest, maar binnen de Magento community begon deze pas echt vanaf november 2015. Standaard wordt Magento 2 meegeleverd met Grunt en LESS, maar de community wilt dolgraag kunnen werken met Gulp en SASS. In principe is Grunt een prima task runner en LESS een prima CSS preprocessor, maar zijn beide op hun retour en toch wel ingehaald door respectievelijk Gulp en SASS.

Dat zie je bijvoorbeeld al in het onderstaande overzicht van gebruikte task runners en preprocessors. Gulp wordt gebruikt door ~44% en Grunt door ~28% van de developers die task runners gebruiken.

Taks runners in 2015

![Task runners in 2015](/media/post-image/q3.jpg "Task runners in 2015")

Preprocessor gebruik in 2015. SASS wordt door 64% van de developers gebruikt die een preprocessor in hun ontwikkel tools gebruiken, tegen een 15% die LESS gebruikt.

![Preprocessor gebruik in 2015](/media/post-image/q1.jpg "Preprocessor gebruik in 2015")

Bron: The State of Front-End Tooling – 2015, Ashley Nolan, [website](https://ashleynolan.co.uk/blog/frontend-tooling-survey-2015-results "The State of Front-End Tooling - 2015")

Hieraan zie je wel dat Gulp en SASS een veel betere keuze zou zijn geweest voor Magento 2, maar er wordt geluisterd naar de community, want waarschijnlijk in Q4 van 2016 zal SASS de preprocessor of choice worden binnen Magento 2 [volgens Alen Kent](https://alankent.me/2016/05/21/magento-2-community-project-moving-from-less-to-sass/). Het SASS theme zal gebaseerd zijn op het [SASS theme gemaakt door SNOW.DOG](https://github.com/SnowdogApps/magento2-theme-blank-sass) en de frontend tools gebruikt worden die ook [door SNOW.DOG ontwikkeld zijn](https://github.com/SnowdogApps/magento2-frontools).

Wij hebben de keuze gemaakt om nu al het SASS theme als uitgangspunt te nemen en Gulp te gebruiken om verschillende Front-end taken uit te voeren. Hiervoor hebben we zelf deze tools aangepast, zodat we precies kunnen gebruiken wat we nodig hebben.

### Front-end tools

De Front-end tools van SNOW.DOG zien er goed uit, maar op dit moment nog iets te instabiel en (voor het project dat we op dit moment uitvoeren) niet specifiek genoeg. De gulp.watch deed het meerdere keren niet goed, waardoor ontwikkelen een stuk langzamer ging. Door een simpele task te maken, specifiek voor het thema dat we aan het ontwikkelen zijn, kunnen we onze SASS bestanden super snel omzetten naar CSS. In combinatie met een autoprefixer, sourcemaps en LiveReload hebben we een super snelle ontwikkeling van styling.

{% highlight bash %}
var src = 'app/design/frontend/<link naar thema>',
    dest = 'pub/static/frontend/<link naar theme>;

gulp.task('styles', function () {
    return gulp.src(src + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ios 6', 'android 4'],
            cascade: false
        }))
        .pipe(concat('styles.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest + '/css'))
        .pipe(livereload());
});
{% endhighlight %}

Vooral de [Sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) zijn handig tijdens het ontwikkelen, zodat je precies kunt zien waar de styling vandaan komt. Als je met Magento 2 begint is dit erg handig. Een andere belangrijke toevoeging is het gebruik van [LiveReload](https://github.com/vohof/gulp-livereload), aangezien Magento 2 herladen tijdens het ontwikkelen erg langzaam is. Nu wordt de styling van een pagina ge-update zonder de pagina te hoeven refreshen.

Op dit moment is deze taak nog heel minimaal en kan nog niet meerdere thema’s tegelijk aan, maar dit zal gaandeweg steeds meer uitgebreid worden met wat we op dat moment nodig hebben.


### Handige XML om mee te starten

Twee handig XML handles zijn het verwijderen en verplaatsen van blokken.

Verwijderen van een blok:

{% highlight xml %}
<referenceBlock name="product.info.addto" remove="true"/>
{% endhighlight %}

Verplaatsen van een blok naar een andere positie op de pagina:

{% highlight xml %}
<move element="product.info.overview" destination="product.info.main" after="page.main.title"/>
{% endhighlight %}

### De webshop vertalen naar het Nederlands

Een belangrijk onderdeel is natuurlijk het vertalen van de webshop. Wij hebben ons best gedaan om het grootste deel te vertalen en zullen dit in de toekomst blijven verbeteren. Onze [Nederlandse vertaling van Magento 2 is te vinden op Bitbucket](https://bitbucket.org/creaminternet/language-nl_nl).

### What is next?

In deel 2 zal ik ingaan op het verbeteren van het iconen systeem van Magento 2, waar er nu icon font gebruikt wordt. Dit is niet de beste keuze qua performance en semantiek. Ook neem ik het overschrijven van styling onder de loep, want door het gebruik van Gulp en SASS (i.p.v. Grunt en LESS) zijn er wat functies om stylesheets te extenden weggevallen, maar kunnen prima opgelost worden met standaard Gulp-SASS functionaliteiten.
