import { Component, OnInit } from '@angular/core';
import { OverlayService } from '@gigaaa/gigaaa-components';
import { MultiSelect } from 'src/app/models/multiSelect';
import { languauges } from './addAgentData';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss']
})
export class AddAgentComponent implements OnInit {
  languages = languauges;
  arrayOfLanguages!: MultiSelect;
  constructor(private OverlayService:OverlayService){

  }
  ngOnInit(): void {
  }
  closeDialog()
  {
    this.OverlayService.close()
  }
}
