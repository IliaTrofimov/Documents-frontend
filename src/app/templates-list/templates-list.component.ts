import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../templates-service';
import { DocTemplate } from '../models';
import { Router } from '@angular/router';

@Component({
  selector: 'templates-list',
  templateUrl: 'templates-list.component.html',
  providers: [TemplatesService]
})
export class TemplatesListComponent implements OnInit {
  templates: DocTemplate[] = [];
  types: string[] = ["Документ"];

  constructor(private templateServ: TemplatesService, private router: Router) {
  }

  ngOnInit(): void {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    this.templateServ.getTemplates().subscribe((data: DocTemplate[]) => this.templates = data);
  }
  
  addTemplate() {
    this.templateServ.createTemplate().subscribe((t: DocTemplate) => 
      this.router.navigate(["templates/" + t.id])
    );
  }

  removeTemplate(id: number) {
    this.templateServ.deleteTemplate(id).subscribe((_) => {
        this.templates = this.templates.filter((t) => t.id !== id);
      }
    );
  }
}
