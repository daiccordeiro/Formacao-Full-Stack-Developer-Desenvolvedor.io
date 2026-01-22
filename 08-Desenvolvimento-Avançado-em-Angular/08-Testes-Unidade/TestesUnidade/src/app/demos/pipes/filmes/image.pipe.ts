import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'imageformater',
    standalone: true
})

export class ImageFormaterPipe implements PipeTransform {
    
    transform(
        imagem: string, 
        caminho: string = 'default', 
        substituir: boolean = false
    ): string {

        if (caminho === 'default') {
            caminho = 'assets/imgFilmes';
        }

        if (!imagem && substituir) {
            imagem = 'semCapa.jpg';
         }
        
         return `/${caminho}/${imagem}`;        
    }
}