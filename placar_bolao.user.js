// ==UserScript==
// @name         Placar_Bolao
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mobile.365sport365.com/*
// @grant        unsafeWindow
// ==/UserScript==

unsafeWindow.pontuacao= function(eH,eA,oH,oA){
	//eR='H' if eH>eA else ('A' if eH<eA else 'D')
	//oR='H' if oH>oA else ('A' if oH<oA else 'D')
	eR= eH>eA ? 'H' : ( eH<eA  ? 'A' :  'D');
	oR= oH>oA ? 'H' : ( oH<oA  ? 'A' :  'D');
	if (eR==oR){
		//placar exato
		if ((eH==oH) && (eA==oA)) return 12.0;

		//acerta empate
		if (oR=='D') return 7.0;

		//acerta score do vencedor
		if ( ( (oR=='H') && (eH==oH) ) || ( (oR=='A') && (eA==oA))  ) return 9.0;

		//acerta score perdedor
		if  ((  (oR=='H') && (eA==oA)) || ( (oR=='A') && (eH==oH))  ) return 6.0;

		//acerta diferença de gols
		if (Math.abs(eH-eA)==Math.abs(oH-oA)) return 4.0;

		//acerta sem as combinacoes acima
		return 3.0;
	}
	else{
		return 0.0;
	}
};

unsafeWindow.bolao=function(){
    $.each([[2,0],[1,0],[2,1],[1,1],[0,1],[0,2],[1,2]], function(){
        var e=this;
        var pos=e[1]<e[0] ? 0 : ( e[1]==e[0] ? 1 : 2 );
        var soma=0;
        $("div[id*='-4140-'] .podEventRow").each(function(){
            var placar=$(this).find('.priceColumn:eq('+pos+') .opp').text().trim();
            if (placar=='') return;
            var oH=Number( placar.split('-')[pos==2 ? 1 : 0]);
            var oA=Number( placar.split('-')[pos==2 ? 0 : 1]);

            var prob=1/Number( $(this).find('.priceColumn:eq('+pos+') .odds').text() );
            soma+=prob*pontuacao(e[0],e[1],oH,oA);
        });
        console.log(e,soma);
    });
};

