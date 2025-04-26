import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // const pathname = request.nextUrl.pathname;
    // if (pathname === "/") {
    //     const response = NextResponse.next();
    //     response.cookies.set("middleware-cookie", "hello!");
    //     return response;
    // }

    // if (pathname === "/profile") {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }
	console.log('hello');
}

export const config = {
    //matcher: ["/profile", "/about/:path*", "/dashboard/:path*"],
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
