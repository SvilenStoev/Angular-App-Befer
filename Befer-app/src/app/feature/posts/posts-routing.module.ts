import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { PostDetailsPageComponent } from "./post-details-page/post-details-page.component";
import { PostsAllComponent } from "./posts-all/posts-all.component";
import { PostsCreateComponent } from "./posts-create/posts-create.component";

const routes: Routes = [
    {
        path: 'posts/all',
        component: PostsAllComponent
    },
    {
        path: 'posts/create',
        canActivate: [AuthGuard],
        component: PostsCreateComponent
    },
    {
        path: 'posts/details/:id',
        canActivate: [AuthGuard],
        component: PostDetailsPageComponent
    }
];

export const PostsRoutingModule = RouterModule.forChild(routes);