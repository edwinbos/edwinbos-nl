---
layout: post
title:  "Front-end ontwikkeling in Magento 2: Deel #2"
date:   2016-9-12 21:32:18 +0200
categories: jekyll update
thumbnail: "/media/post/croissant.jpg"
---

Vorige week heb ik geschreven over het gebruik van SASS/SCSS in Magento 2 en
Gulp als task runner. Na deze post zijn we druk bezig geweest met het maken van
echte functionaliteiten in Magento 2. Hierover schrijf ik deze week. Een
belangrijk onderdeel is het schrijven, overschrijven en het uitbreiden van CSS
met een balans tussen maintainable code en zo efficiënte mogelijke code voor de
eindgebruiker. Daarnaast vertel ik ook over Magento UI (het CSS gedeelte daarvan)
en een SVG icon systeem in Magento 2. Als laatste wat tips en trucs die handig
zijn als je zelf aan het ontwikkelen bent in Magento 2, scheelt je weer een
halfuur zoeken.

### CSS schrijven in Magento 2, extend, overschrijven en schone code

In het vorige deel van ontwikkelen voor Magento 2 heb ik verteld dat wij gebruik
maken van Gulp om onze SASS/SCSS te compileren, maar dit zorgt er (op dit moment)
voor dat je functionaliteiten mist van standaard Magento, waarbij je stylesheets
kunt overschrijven en/of extenden.

In principe hoeft dit geen probleem te zijn, omdat je met SASS heel simpel
andere bestanden kan importeren en dus kan extenden. Een voorbeeld is:

{% highlight css %}
@import 'link/naar/core/scss/blocks/tables';

table {
  /* css code hier */
}
{% endhighlight %}

Voor ons is het uitbreiden van een stylesheet meestal geen goede oplossing. Omdat wij zoveel aanpassen aan de styling van een webshop, zou je alleen maar bezig zijn met styling overschrijven, waardoor er teveel niet gebruikte code in je codebase komt en je steeds specifieker moet gaan stylen. Aan het eind van de rit heb je een stylesheet die qua grote 2 keer zo groot is en erg moeilijk te onderhouden is.

Een betere optie is om een stylesheet volledig te kopiëren naar je thema en daar in de aanpassingen te doen, zodat je geen dubbele specificaties van één element hebt en je code schoon blijft. Gelukkig zijn de stylesheets opgesplitst in kleine modules, waardoor je alleen de stylesheet hoeft te kopiëren en aan te passen die je nodig hebt.

Wij gebruiken het thema “theme-blank-sass” van SNOW.DOG, waarin het startpunt van de stylesheets styles.scss is. Hierin wordt alle styling gedefinieerd. Deze ziet er ongeveer zo uit:

{% highlight css %}
/* Theme blocks */
 @import 'blocks/extends';
 @import 'blocks/typography';
 @import 'blocks/layout';
 @import 'blocks/tables';
{% endhighlight %}

Het probleem zit hem er in dat je vanuit je eigen thema moet gaan linken naar het hoofd thema, die helemaal in je vendor map staat. De styles.scss ziet er dan ook als volgt uit:

{% highlight css %}
/* Theme blocks */
 @import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/extends'; 
@import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/typography'; 
@import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/layout';
 @import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/tables';
{% endhighlight %}

Met SASS kun je geen variabele maken van het pad en zul je dus per import de volledige link moeten definiëren. Misschien heeft iemand een beter idee om dit netjes te krijgen. Zelf denk ik aan een fallback systeem, wanneer het bestand niet gevonden wordt in de het huidige theme de task runner gaat zoeken in het originele thema. Oftewel, work in progress.

Wanneer we nu de styling van tables willen aanpassen, zullen we het bestand tables.scss moeten kopiëren naar ons eigen thema en wordt de SCSS in onze styles.scss als volgt:

{% highlight css %}
/* Theme blocks */ 
@import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/extends';
 @import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/typography'; 
@import '../../../../../../../vendor/snowdog/theme-blank-sass/styles/blocks/layout';
 @import 'blocks/tables';
{% endhighlight %}

Zo wordt alleen tables.scss in ons eigen theme ingeladen, hebben we geen duplicatie code en hebben we volledige controle over wat er gebeurd met onze front-end. Het voornaamste is dat we uiteindelijk de meest snelle code hebben die we aan de eind gebruiker kunnen voorschotelen.

### Magento UI (CSS)

In Magento 2 zit een eigen front-end library met een set aan user interface componenten. Magento zegt er dit zelf over in de dev docs:

> “The Magento UI library is a flexible LESS-based frontend library designed to  assist Magento theme developers. It employs a set of mixins for base elements to ease frontend theme development and customization.”

Bron: Magento Developer Documentation (2.0) – Magento UI library

Wij gebruiken het SASS thema van SNOW.DOG, hierin is (voor nu) ook Magento UI meegenomen. In theorie klinkt het ook goed, een flexibel LESS/SASS gebaseerde frontend bibliotheek, maar in de praktijk loop je als professionele front-end developer tegen meer problemen aan dan dat het oplost en blijkt het helemaal niet zo flexibel te zijn. Het makkelijkste is het uit te leggen aan de hand van een voorbeeld.

Neem bijvoorbeeld de styling van een button in Magento 2. Met onderstaande code kun je een element makkelijk de styling geven van een button:

{% highlight css %}
.action {
    @include lib-button();
}
{% endhighlight %}

Binnen lib-button() kun je nu verschillende parameters aangeven, zoals $_button-font-size voor de grote van de tekst. Klinkt goed, maar wat als je een schaduw wilt toevoegen aan deze knop? Deze optie staat niet in de lib-button mixin in de Magento UI library.

Je kunt nu verschillende dingen doen:

Box-shadow toevoegen aan de library
De box shadow toevoegen aan het button element
Mixin uit het element halen en eigen CSS schrijven voor de button class
Wij hebben in meerdere gevallen voor het laatste gekozen, omdat overschrijven van een library geen goed idee is. De library kan ge-update worden, oftewel externe afhankelijkheden. De tweede optie om de box shadow aan het element .action toe te voegen is ook niet handig, omdat in Magento meerdere classes worden gebruikt voor een button (:S) en we dus alle verschillende elementen moeten onderhouden waar de mixin lib-button() aan is toegevoegd. We hebben voor de laatste optie gekozen, omdat deze makkelijk te onderhouden is en Magento veel extra opmaak toevoegt aan de button, die we helemaal niet nodig hebben. Het komt er op neer dat we nu een button hebben opgemaakt (met alle states er op en er aan) met 40 regels code en Magento dit doet met ongeveer 200 regels code.

Jammer dat ze niet hebben gekeken naar de structuur van andere frameworks, zoals Bootstap en Foundation, die de styling op een class name zetten en niet voor alles mixins gebruiken.

### (SVG) icon system in Magento 2

Magento 2 komt standaard met een icon font die in de thema’s Blank en Luma worden gebruikt. Icon fonts waren een paar jaar geleden interessant toen we niet veel beter hadden dan afbeelding sprites met verschillende afmetingen (@2x, @3x etc…). Tegenwoordig maken we gebruik van SVG, omdat deze tot tegenstelling van een icon font veel sneller laden en we veel meer invloed hebben over het tonen van de iconen (en andere vector afbeeldingen). Tegenwoordig is de browser support goed, dus geen reden om het niet te gebruiken. Chris Coyier heeft hier in 2014 al een mooie opsomming van gemaakt, alhoewel het toen nog lang niet door alle verschillende browsers werd ondersteund. Nog meer weten waarom we over moeten op SVG iconen? Luister eens naar de aflevering van Full Stack Radio met Sara Soueidan.

In principe is het maken van een SVG sprite (zowel een CSS sprite als een symbol sprite) niet zo lastig als de Gulp tasks goed staan instelt. Wij gebruiken hiervoor de package gulp-svg-sprite, wat een Gulp wrapper is om svg-sprite.

Zoals gezegd maken we een CSS en Symbol sprite. Het enige waar wij tegen aan liepen in Magento 2 was dat bestanden gecompileerd worden door Magento zelf en bestanden dus in een andere map gezet worden (pub/static), waar je vanuit je “source” map geen toegang toe hebt. Om dit op te lossen hebben wij ervoor gekozen om twee taken te maken. De eerste taak zet alle gecompileerde SVG bestanden in de pub/static folder en de tweede taak zet alle benodigde SCSS in de “source” folder, waardoor we deze CSS definities kunnen includen in de rest van de CSS en we de verschillende elementen kunnen gebruiken. Werkt perfect.

### Magento 2 Tips & Trucs

Een paar handige tips die altijd handig zijn om te weten als je met een nieuw systeem begint.

#### Reviews

Als je geen reviews wilt op je shop kun je deze uitzetten via het tabblad Stores > Configuratie > Advanced > Advanced. Er is geen instelling in Magento 2 waarmee je dit kunt doen.
Wil je de reviews module wel gebruiken en je wil de gebruiker een rating (in de vorm van sterren) aan een product kunnen geven dan kun je via het menu naar Stores > Rating naar de pagina die dit mogelijk maakt.

#### Afbeelding in je email

Wil je een afbeelding toevoegen aan je transactionele email? Dat kan, maar je kunt er erg weinig over vinden. Het is eigenlijk heel simpel, maar je moet het even weten:

{% highlight css %}
{ { view url="images/image.jpg” } }
{% endhighlight %}

#### Wishlist en Compare

Net als in Magento 1 kun je de verlanglijst module uitzetten via de settings van Magento 2, maar de vergelijk module kan alleen via de code (in de templates) uitgezet worden.

### Volgende keer…

In het volgende deel gaan we kijken naar templates en hoe we het beste gebruik kunnen maken van layout XML in Magento 2.
