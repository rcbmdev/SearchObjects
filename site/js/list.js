$.ajax(
  { url: 'https://s3.amazonaws.com/search-site/dados.json',
   dataType: 'json',
   crossDomain: true,
   success: function (dados) {
      console.log(dados);
      montaLista(dados);
      // montaTabela(dados);
      //limpaTabela();
      }
  });

function montaLista(dados){
    for (var dados of dados) {
        //var h2 = document.querySelector('titulo')
        console.log(dados.imagem);
        var div= document.createElement("div");
        div.className = "gallery";
        newlink = document.createElement('a');
        newlink.target = '_blank';
        newlink.href = dados.imagem;
        imagem = document.createElement("img");
        imagem.height = 300;
        imagem.width = 300;
        imagem.src = dados.imagem;
        imagem.classList.add("rounded");
        imagem.classList.add("img-fluid");
        imagem.classList.add("pull-left");
        
        
        div.appendChild(newlink);
        newlink.appendChild(imagem);

        var list = document.querySelector("#album-list");
        list.appendChild(div);
    }

}