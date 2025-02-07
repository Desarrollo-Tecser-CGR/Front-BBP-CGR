import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ResumeTableComponent } from 'app/layout/common/resume-table/resume-table.component';
import { AuditComponent } from 'app/layout/common/audit/audit.component';
import { ActivatedRoute } from '@angular/router';
import { EmailAuditComponent } from "../../layout/common/email-audit/email-audit.component";
import { MatDivider } from '@angular/material/divider';
import { MatDividerModule } from '@angular/material/divider';

MatDivider
@Component({
  selector: 'app-diffusion',
  standalone: true,
  imports: [
    MatTabsModule,
    ResumeTableComponent,
    AuditComponent,
    EmailAuditComponent,
    MatDivider,
    MatDividerModule
],
  templateUrl: './diffusion.component.html',
  styleUrl: './diffusion.component.scss'
})
export class DiffusionComponent {
  @Input() Id: number;
  id:string='';

  constructor(private route:ActivatedRoute){}
  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id');
    console.log('id en difusion:', this.id)
  }
}
export class DividerOverviewExample {}
