import { Routes } from '@angular/router';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostAddComponent } from './post-add/post-add.component';
import { PostUpdateComponent } from './post-update/post-update.component';
import { GetbyidComponent } from './getbyid/getbyid.component';

export const routes: Routes = [
    { path: '', component: PostsListComponent },             // Home - List all posts
    { path: 'add', component: PostAddComponent },           // Add a new post
    { path: 'update/:id', component: PostUpdateComponent }, // Update post by ID
    { path: 'detail/:id', component: GetbyidComponent } 
];
