// ==UserScript==
// @name         Show the pokemon details
// @namespace    http://tampermonkey.net/
// @version      2024-04-25
// @description  Show the pokemon details when I've highlighted the pokemon name in the page
// @author       Josh Parker
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js
// @grant        GM_xmlhttpRequest
// @connect      pokeapi.co
// ==/UserScript==

import insertCSS from './insert-css';
import makeCarousel from './make-carousel';

const pokemonMegaRegExp = /(bulbasaur|ivysaur|venusaur|charmander|charmeleon|charizard|squirtle|wartortle|blastoise|caterpie|metapod|butterfree|weedle|kakuna|beedrill|pidgey|pidgeotto|pidgeot|rattata|raticate|spearow|fearow|ekans|arbok|pikachu|raichu|sandshrew|sandslash|nidoran-f|nidorina|nidoqueen|nidoran-m|nidorino|nidoking|clefairy|clefable|vulpix|ninetales|jigglypuff|wigglytuff|zubat|golbat|oddish|gloom|vileplume|paras|parasect|venonat|venomoth|diglett|dugtrio|meowth|persian|psyduck|golduck|mankey|primeape|growlithe|arcanine|poliwag|poliwhirl|poliwrath|abra|kadabra|alakazam|machop|machoke|machamp|bellsprout|weepinbell|victreebel|tentacool|tentacruel|geodude|graveler|golem|ponyta|rapidash|slowpoke|slowbro|magnemite|magneton|farfetchd|doduo|dodrio|seel|dewgong|grimer|muk|shellder|cloyster|gastly|haunter|gengar|onix|drowzee|hypno|krabby|kingler|voltorb|electrode|exeggcute|exeggutor|cubone|marowak|hitmonlee|hitmonchan|lickitung|koffing|weezing|rhyhorn|rhydon|chansey|tangela|kangaskhan|horsea|seadra|goldeen|seaking|staryu|starmie|mr-mime|scyther|jynx|electabuzz|magmar|pinsir|tauros|magikarp|gyarados|lapras|ditto|eevee|vaporeon|jolteon|flareon|porygon|omanyte|omastar|kabuto|kabutops|aerodactyl|snorlax|articuno|zapdos|moltres|dratini|dragonair|dragonite|mewtwo|mew|chikorita|bayleef|meganium|cyndaquil|quilava|typhlosion|totodile|croconaw|feraligatr|sentret|furret|hoothoot|noctowl|ledyba|ledian|spinarak|ariados|crobat|chinchou|lanturn|pichu|cleffa|igglybuff|togepi|togetic|natu|xatu|mareep|flaaffy|ampharos|bellossom|marill|azumarill|sudowoodo|politoed|hoppip|skiploom|jumpluff|aipom|sunkern|sunflora|yanma|wooper|quagsire|espeon|umbreon|murkrow|slowking|misdreavus|unown|wobbuffet|girafarig|pineco|forretress|dunsparce|gligar|steelix|snubbull|granbull|qwilfish|scizor|shuckle|heracross|sneasel|teddiursa|ursaring|slugma|magcargo|swinub|piloswine|corsola|remoraid|octillery|delibird|mantine|skarmory|houndour|houndoom|kingdra|phanpy|donphan|porygon2|stantler|smeargle|tyrogue|hitmontop|smoochum|elekid|magby|miltank|blissey|raikou|entei|suicune|larvitar|pupitar|tyranitar|lugia|ho-oh|celebi|treecko|grovyle|sceptile|torchic|combusken|blaziken|mudkip|marshtomp|swampert|poochyena|mightyena|zigzagoon|linoone|wurmple|silcoon|beautifly|cascoon|dustox|lotad|lombre|ludicolo|seedot|nuzleaf|shiftry|taillow|swellow|wingull|pelipper|ralts|kirlia|gardevoir|surskit|masquerain|shroomish|breloom|slakoth|vigoroth|slaking|nincada|ninjask|shedinja|whismur|loudred|exploud|makuhita|hariyama|azurill|nosepass|skitty|delcatty|sableye|mawile|aron|lairon|aggron|meditite|medicham|electrike|manectric|plusle|minun|volbeat|illumise|roselia|gulpin|swalot|carvanha|sharpedo|wailmer|wailord|numel|camerupt|torkoal|spoink|grumpig|spinda|trapinch|vibrava|flygon|cacnea|cacturne|swablu|altaria|zangoose|seviper|lunatone|solrock|barboach|whiscash|corphish|crawdaunt|baltoy|claydol|lileep|cradily|anorith|armaldo|feebas|milotic|castform|kecleon|shuppet|banette|duskull|dusclops|tropius|chimecho|absol|wynaut|snorunt|glalie|spheal|sealeo|walrein|clamperl|huntail|gorebyss|relicanth|luvdisc|bagon|shelgon|salamence|beldum|metang|metagross|regirock|regice|registeel|latias|latios|kyogre|groudon|rayquaza|jirachi|deoxys|turtwig|grotle|torterra|chimchar|monferno|infernape|piplup|prinplup|empoleon|starly|staravia|staraptor|bidoof|bibarel|kricketot|kricketune|shinx|luxio|luxray|budew|roserade|cranidos|rampardos|shieldon|bastiodon|burmy|wormadam|mothim|combee|vespiquen|pachirisu|buizel|floatzel|cherubi|cherrim|shellos|gastrodon|ambipom|drifloon|drifblim|buneary|lopunny|mismagius|honchkrow|glameow|purugly|chingling|stunky|skuntank|bronzor|bronzong|bonsly|mime-jr|happiny|chatot|spiritomb|gible|gabite|garchomp|munchlax|riolu|lucario|hippopotas|hippowdon|skorupi|drapion|croagunk|toxicroak|carnivine|finneon|lumineon|mantyke|snover|abomasnow|weavile|magnezone|lickilicky|rhyperior|tangrowth|electivire|magmortar|togekiss|yanmega|leafeon|glaceon|gliscor|mamoswine|porygon-z|gallade|probopass|dusknoir|froslass|rotom|uxie|mesprit|azelf|dialga|palkia|heatran|regigigas|giratina|cresselia|phione|manaphy|darkrai|shaymin|arceus|victini|snivy|servine|serperior|tepig|pignite|emboar|oshawott|dewott|samurott|patrat|watchog|lillipup|herdier|stoutland|purrloin|liepard|pansage|simisage|pansear|simisear|panpour|simipour|munna|musharna|pidove|tranquill|unfezant|blitzle|zebstrika|roggenrola|boldore|gigalith|woobat|swoobat|drilbur|excadrill|audino|timburr|gurdurr|conkeldurr|tympole|palpitoad|seismitoad|throh|sawk|sewaddle|swadloon|leavanny|venipede|whirlipede|scolipede|cottonee|whimsicott|petilil|lilligant|basculin|sandile|krokorok|krookodile|darumaka|darmanitan|maractus|dwebble|crustle|scraggy|scrafty|sigilyph|yamask|cofagrigus|tirtouga|carracosta|archen|archeops|trubbish|garbodor|zorua|zoroark|minccino|cinccino|gothita|gothorita|gothitelle|solosis|duosion|reuniclus|ducklett|swanna|vanillite|vanillish|vanilluxe|deerling|sawsbuck|emolga|karrablast|escavalier|foongus|amoonguss|frillish|jellicent|alomomola|joltik|galvantula|ferroseed|ferrothorn|klink|klang|klinklang|tynamo|eelektrik|eelektross|elgyem|beheeyem|litwick|lampent|chandelure|axew|fraxure|haxorus|cubchoo|beartic|cryogonal|shelmet|accelgor|stunfisk|mienfoo|mienshao|druddigon|golett|golurk|pawniard|bisharp|bouffalant|rufflet|braviary|vullaby|mandibuzz|heatmor|durant|deino|zweilous|hydreigon|larvesta|volcarona|cobalion|terrakion|virizion|tornadus|thundurus|reshiram|zekrom|landorus|kyurem|keldeo|meloetta|genesect|chespin|quilladin|chesnaught|fennekin|braixen|delphox|froakie|frogadier|greninja|bunnelby|diggersby|fletchling|fletchinder|talonflame|scatterbug|spewpa|vivillon|litleo|pyroar|flabebe|floette|florges|skiddo|gogoat|pancham|pangoro|furfrou|espurr|meowstic|honedge|doublade|aegislash|spritzee|aromatisse|swirlix|slurpuff|inkay|malamar|binacle|barbaracle|skrelp|dragalge|clauncher|clawitzer|helioptile|heliolisk|tyrunt|tyrantrum|amaura|aurorus|sylveon|hawlucha|dedenne|carbink|goomy|sliggoo|goodra|klefki|phantump|trevenant|pumpkaboo|gourgeist|bergmite|avalugg|noibat|noivern|xerneas|yveltal|zygarde|diancie|hoopa|volcanion|rowlet|dartrix|decidueye|litten|torracat|incineroar|popplio|brionne|primarina|pikipek|trumbeak|toucannon|yungoos|gumshoos|grubbin|charjabug|vikavolt|crabrawler|crabominable|oricorio|cutiefly|ribombee|rockruff|lycanroc|wishiwashi|mareanie|toxapex|mudbray|mudsdale|dewpider|araquanid|fomantis|lurantis|morelull|shiinotic|salandit|salazzle|stufful|bewear|bounsweet|steenee|tsareena|comfey|oranguru|passimian|wimpod|golisopod|sandygast|palossand|pyukumuku|type-null|silvally|minior|komala|turtonator|togedemaru|mimikyu|bruxish|drampa|dhelmise|jangmo-o|hakamo-o|kommo-o|tapu-koko|tapu-lele|tapu-bulu|tapu-fini|cosmog|cosmoem|solgaleo|lunala|nihilego|buzzwole|pheromosa|xurkitree|celesteela|kartana|guzzlord|necrozma|magearna|marshadow|poipole|naganadel|stakataka|blacephalon|zeraora|meltan|melmetal|grookey|thwackey|rillaboom|scorbunny|raboot|cinderace|sobble|drizzile|inteleon|skwovet|greedent|rookidee|corvisquire|corviknight|blipbug|dottler|orbeetle|nickit|thievul|gossifleur|eldegoss|wooloo|dubwool|chewtle|drednaw|yamper|boltund|rolycoly|carkol|coalossal|applin|flapple|appletun|silicobra|sandaconda|cramorant|arrokuda|barraskewda|toxel|toxtricity|sizzlipede|centiskorch|clobbopus|grapploct|sinistea|polteageist|hatenna|hattrem|hatterene|impidimp|morgrem|grimmsnarl|obstagoon|perrserker|cursola|sirfetchd|mr-rime|runerigus|milcery|alcremie|falinks|pincurchin|snom|frosmoth|stonjourner|eiscue|indeedee|morpeko|cufant|copperajah|dracozolt|arctozolt|dracovish|arctovish|duraludon|dreepy|drakloak|dragapult|zacian|zamazenta|eternatus|kubfu|urshifu|zarude|regieleki|regidrago|glastrier|spectrier|calyrex|wyrdeer|kleavor|ursaluna|basculegion|sneasler|overqwil|enamorus|sprigatito|floragato|meowscarada|fuecoco|crocalor|skeledirge|quaxly|quaxwell|quaquaval|lechonk|oinkologne|tarountula|spidops|nymble|lokix|pawmi|pawmo|pawmot|tandemaus|maushold|fidough|dachsbun|smoliv|dolliv|arboliva|squawkabilly|nacli|naclstack|garganacl|charcadet|armarouge|ceruledge|tadbulb|bellibolt|wattrel|kilowattrel|maschiff|mabosstiff|shroodle|grafaiai|bramblin|brambleghast|toedscool|toedscruel|klawf|capsakid|scovillain|rellor|rabsca|flittle|espathra|tinkatink|tinkatuff|tinkaton|wiglett|wugtrio|bombirdier|finizen|palafin|varoom|revavroom|cyclizar|orthworm|glimmet|glimmora|greavard|houndstone|flamigo|cetoddle|cetitan|veluza|dondozo|tatsugiri|annihilape|clodsire|farigiraf|dudunsparce|kingambit|great-tusk|scream-tail|brute-bonnet|flutter-mane|slither-wing|sandy-shocks|iron-treads|iron-bundle|iron-hands|iron-jugulis|iron-moth|iron-thorns|frigibax|arctibax|baxcalibur|gimmighoul|gholdengo|wo-chien|chien-pao|ting-lu|chi-yu|roaring-moon|iron-valiant|koraidon|miraidon|walking-wake|iron-leaves|dipplin|poltchageist|sinistcha|okidogi|munkidori|fezandipiti|ogerpon|archaludon|hydrapple|gouging-fire|raging-bolt|iron-boulder|iron-crown|terapagos|pecharunt)/gi;
const pokemonCards = new Set();
const pokeResponses = new Set();
let showCards = true;

(function pokemon() {
 insertCSS(`
#pokemon-card-container {
 position: fixed;
 display: flex;
 flex-wrap: wrap;
 flex-direction: row;
 left: 0;
 bottom: 0;
 z-index: 9001;
 max-height: 100dvh;
 overflow: auto;
}

#pokemon-card-container > div[id^='pokemon-image'] {
 padding: 10px;
 border: solid blue;
 margin: 5px;
 border-radius: 12px;
 background-color: rgba(255,255,255,0.6);
 overflow: hidden;
}

#pokemon-card-container > div[id^='pokemon-image'] > h3 {
 text-align: center;
}

#pokemon-card-container > div[id^='pokemon-image'] > div {
  width: 207px;
  height: 184px;
}

#pokemon-card-container > div[id^='pokemon-image'] > div.image {
 background-repeat: no-repeat;
 background-position: center;
}
`, 'pokemon-card');
 const pokemonCardContainer = document.createElement('div');
 document.addEventListener('keydown', async ({ code }) => {
  if (code === 'KeyP') {
   const selected = window.getSelection().toString();
   const pokemonNames = [...(
    new Set(selected.match(pokemonMegaRegExp).map((e) => e.toLocaleLowerCase()))
   )];
   console.log(pokemonNames);
   if (pokemonNames) {
    const urls = pokemonNames.map((pokemonName) => `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    pokemonCardContainer.id = 'pokemon-card-container';

    pokemonNames.forEach((pokemonName) => {
     if (pokemonCards.has(pokemonName)) {
      const {
       x, y, width, height,
      } = document.querySelector(`#pokemon-image-${pokemonName}`).getBoundingClientRect();

      // eslint-disable-next-line no-undef
      confetti({
       origin: {
        x: (x + width / 2) / window.innerWidth,
        y: (y + height / 2) / window.innerHeight,
       },
       particleCount: 150,
       spread: 180,
       startVelocity: 10,
       zIndex: 9002,
      });
      return;
     }

     const pokemonImageDiv = document.createElement('div');
     pokemonImageDiv.id = `pokemon-image-${pokemonName}`;
     pokemonImageDiv.innerHTML = `<h3>${pokemonName.replace(/^(.)/, (_, p1) => p1.toLocaleUpperCase())}</h3>
<div class="flavor-text-container" id="flavor-text-container-${pokemonName}"></div>
<div class="image" style="background-image: url('https://www.smogon.com/dex/media/sprites/xy/${pokemonName}.gif');"></div>`;

     pokemonCardContainer.appendChild(pokemonImageDiv);

     pokemonCards.add(pokemonName);
    });

    document.body.appendChild(pokemonCardContainer);

    try {
     const pokeResponseGenerator = (async function* pokeResponseGenerator() {
      for (let i = 0; i < urls.length; i++) {
       console.log(urls[i]);

       // if we have previously yielded a response for this pokemon (urls[i])
       // then we expect to not yield another response
       // for the same pokemon ever again
       if (!pokeResponses.has(urls[i])) {
        pokeResponses.add(urls[i]);
        yield GM.xmlHttpRequest({ url: urls[i], responseType: 'json' });
       }
      }
     }());

     // ignoring the advice that generators are bad...
     // JUST THIS ONCE FOR LEARNING/INFORMATIONAL PURPOSES!
     // eslint-disable-next-line no-restricted-syntax
     for await (const { response } of pokeResponseGenerator) {
      const flavorTextContainer = document.querySelector(`#flavor-text-container-${response.name}`);
      const englishFlavorText = response.flavor_text_entries.filter((e) => e.language.name === 'en');
      makeCarousel(flavorTextContainer, englishFlavorText
       .map(({ flavor_text: flavorText }) => {
        const p = document.createElement('p');
        p.appendChild(new Text(flavorText.replace(/[\n\f]/g, ' ')));
        return p;
       }));
     }
    } catch (e) {
     console.error('caught an error trying to make gm xml http request! 🧟');
     console.error(e);
    }
   } else {
    console.log(`${selected} is not a pokemon name from the pokemon mega regexp 😡`);
   }
  } else if (code === 'KeyH') {
   if (showCards) {
    pokemonCardContainer.style.setProperty('display', 'none');
    showCards = false;
   } else {
    pokemonCardContainer.style.removeProperty('display');
    showCards = true;
   }
  }
 });
}());
