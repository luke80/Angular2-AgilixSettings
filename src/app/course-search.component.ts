import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';

import { AuthService } from './services/auth.service';
import { RequestService } from './services/request.service';
import { DataEmitterService } from './services/data-emitter.service';
import { IDlapResponse } from './models/dlap-response.model';

@Component({
  templateUrl: './course-search.component.html',
  styleUrls: ['./course-search.component.scss']
})

export class CourseSearchComponent implements OnInit {
  private courseResponse: IDlapResponse;
  private filterBy: string = "";
  private visibleCourses: any[] = [];
  private sortOptions = [{
      name: "Course title",
      property: "title"
    },{
      name: "Course code",
      property: "reference"
    },{
      name: "Course creation date",
      property: "creationdate"
    },{
      name: "Course update date",
      property: "modifieddate"
  }];
  private operation: string;
  public sortBy: string = "creationdate";
  public sortAscending: boolean = false;
  
  constructor( private requestService: RequestService, private authService: AuthService, private dataService: DataEmitterService, private router: Router, private route: ActivatedRoute, private http: Http ) {
    this.operation = this.route.snapshot.params['operation'];
  }

  ngOnInit() {
    this.requestService.doRequest('listcourses', {
      domainid:this.route.snapshot.params['domainid'],
      limit:1000
    }).subscribe(
      data => this.courseResponse = data,
      resp => {
        //console.log("resp: ", resp )
      },
      () => {
        if(!!this.courseResponse && !!this.courseResponse.response && !! this.courseResponse.response.courses && !! this.courseResponse.response.courses.course) {
          this.filterCourses();
          for(let course of this.courseResponse.response.courses.course) {
            /*  //  Demo request course data (not needed)
            this.requestService.doRequest("getcourse2", {courseid: course.id, select:"data"}).subscribe(
              data => {
                console.log(data);
              }
            );
            */
          }
        }
      }
    );
  }

  filterCourses(): void {
    if(!!this.courseResponse) {
      let courses = this.courseResponse.response.courses.course;
      console.log("filterBy", this.filterBy);
      if(this.filterBy == "") {
        this.visibleCourses = courses.slice(0);
      } else {
        this.visibleCourses = courses.filter(
          course => {
            return (course.title.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) !== -1 || course.reference.toLocaleLowerCase().indexOf(this.filterBy.toLocaleLowerCase()) !== -1);
          }
        );
      }
    }
  }

  sortCourses(): void {
    if(!!this.courseResponse) {
      let sortBy = this.sortBy;
      let high = (this.sortAscending)?-1:1;
      let low = (this.sortAscending)?1:-1;
      this.visibleCourses.sort(function(a, b) {
        if(a[sortBy].toLocaleLowerCase() > b[sortBy].toLocaleLowerCase())
          return high;
        else if(a[sortBy].toLocaleLowerCase() == b[sortBy].toLocaleLowerCase())
          return 0;
        else //  if(a[this.sortBy] < b[this.sortBy])
          return low;
      });
    }
  }
  

  getCourseManifest(courseid: number) {
    this.requestService.doRequest('getmanifest', {
      entityid:courseid,
    }).subscribe();
  }

  private error(err: Response) {
    console.error(err)
    return Observable.throw(err.json().error || 'RequestService error')
  }

  navigateToCourse(course): void {
    console.log("course; ", course);
  }
}