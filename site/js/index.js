$(document).ready(function(){
    AWS.config.region = 'us-east-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:823e7ebe-c399-4568-a339-3bb909032cb5',
    });
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01',
        params: {Bucket: 'search-objects'}
    });
    //update - get reference to Rekognition client
    var rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

    $('#addphoto').click(function(event) {
            var files = $('#photoupload').prop('files');
            if (!files.length) {
               return alert('Please choose a file to upload!');
            }
            var file = files[0];
            //Updated section
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                var paramsModeration = {
                    Image: {
                        Bytes: getBinary(reader.result),
                    }
                };
                //get moderation labels from Rekognition service
                rekognition.detectModerationLabels(paramsModeration, function(err, data) {
                    if (err) {
                        alert('Erro ocorrido durante a Moderação de Imagem');
                        return;
                    } 
                    console.log(data);
                    //fetch the parent moderation labels only - filter the rest
                    if (data != null && data.ModerationLabels.length > 0) {  
                        var parentLabels = data.ModerationLabels.filter(x=>x.ParentName=='').map(y=>y.Name);
                        if (parentLabels.indexOf('Suggestive') >= 0) {
                            alert('Imagem contém partes explícitas. Não podemos permitir o upload.');
                            return;
                        } 
                        else {
                            if (confirm('Imagem contém conteúdo sugestivo. Deseja enviar?') == false) {
                               return;
                            }
                        }
                    }
                    s3.upload({
                        Key: file.name,
                        Body: file,
                        ACL: 'public-read'
                        }, function(err, data) {
                            if (err) {
                                return alert('Erro ao enviar a foto: ', err.message);
                            }
                            alert('Sucesso ao enviar a foto');
                        });
                });    
            }
        });

    $('#search').click(function(event) {
        var term = $('#searchtext').val();
        if (!term) {
            return alert('Please enter a search text!');
        }
        var url =  'https://qgh3pncrdb.execute-api.us-east-1.amazonaws.com/dev?search=' + term;
        $.get(url, function(data){
            $('#album-search').empty();
            $.each(data, function(key, value) {
                var imageurl = value.titulo;
                var tags = value.labels.join(', ');
                var htmlelements = [
                    '<div class="gallery">',
                    '<a target="_blank" href="' + imageurl + '"><img height="300" width="300" class="rounded img-fluid pull-left " src="' + imageurl +'"/></a>',
                    '<div class="desc">' + tags + '</div>',
                    '</div>'
                ]
                var img = gethtml(htmlelements);
                //Limpa a lista de imagens quando for buscar
                var lista = document.getElementById("album-list");
                lista.innerHTML = "";
                $(img).appendTo('#album-search');
            });
        });
    });
   function gethtml(elements) {
      return elements.join('\n');
   }
   //Update
       function getBinary(encodedFile) {
            var base64Image = encodedFile.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
            var binaryImg = atob(base64Image);
            var length = binaryImg.length;
            var ab = new ArrayBuffer(length);
            var ua = new Uint8Array(ab);
            for (var i = 0; i < length; i++) {
                ua[i] = binaryImg.charCodeAt(i);
            }
            return ab;
       }
});
