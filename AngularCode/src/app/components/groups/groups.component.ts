import { Component, OnInit } from '@angular/core';
declare let $: any;
import Typed from 'typed.js';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  public turn:string = 'Matutino';
  constructor() { }

  ngOnInit(): void {
    this.startTyped();
  }

  //---------------------------- CHANGE TURN ---------------------------------------//
  changeTurn(turn:string)
  {
    this.turn = turn;
  }

  //---------------------------- TYPED ---------------------------------------//
  startTyped() {
    setTimeout(() => {
      if ($('.typedGroups').length) {
        var typed_strings = $(".typedGroups").data('typed-items');
        typed_strings = typed_strings.split(',')
        new Typed('.typedGroups', {
          strings: typed_strings,
          loop: false,
          typeSpeed: 50
        });
      }
    }, 1);
  }
}
