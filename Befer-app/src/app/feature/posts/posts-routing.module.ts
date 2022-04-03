import { RouterModule, Routes } from "@angular/router";
import { PostDetailsPageComponent } from "./post-details-page/post-details-page.component";

const routes: Routes = [
    {
        path: 'posts/details/:id',
        component: PostDetailsPageComponent
    }
];

export const PostsRoutingModule = RouterModule.forChild(routes);