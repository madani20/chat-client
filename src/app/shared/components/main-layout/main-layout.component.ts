import { Component } from '@angular/core';
import { ChatWindowComponent } from "../../../features/chat/components/chat-window/chat-window.component";
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'mad-main-layout',
    imports: [ChatWindowComponent, HeaderComponent, FooterComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
