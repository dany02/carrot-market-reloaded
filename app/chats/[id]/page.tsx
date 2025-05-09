import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
    const room = await db.chatRoom.findUnique({
        where: {
            id,
        },
        include: {
            users: {
                select: { id: true },
            },
        },
    });
    if (room) {
        const session = await getSession();
        const canSee = Boolean(
            room.users.find((user) => user.id === session.id)
        );
        if (!canSee) {
            return null;
        }
    }
    return room;
}

async function getMessages(chatRoomId: string) {
    const message = await db.message.findMany({
        where: {
            chatRoomId,
        },
        select: {
            id: true,
            payload: true,
            created_at: true,
            userId: true,
            user: {
                select: {
                    username: true,
                    avatar: true,
                },
            },
        },
    });
    return message;
}

async function getUserProfile(){
	const session = await getSession();
	const user = await db.user.findUnique({
		where:{
			id:session.id!,
		},
		select:{
			username:true,
			avatar:true,
		}
	});
	return user;
}

export type InitialMessages = Prisma.PromiseReturnType<typeof getMessages>;

export default async function ChatRoom({ params }: { params: { id: string } }) {
    const room = await getRoom(params.id);
    if (!room) {
        return notFound();
    }
	const initialMessages = await getMessages(params.id);
	const session = await getSession();
	const user = await getUserProfile();

	if(!user){
		return notFound();
	}

    return (
		<ChatMessagesList chatRoomId={params.id} userId={session.id!} username={user.username} avatar={user.avatar!} initialMessages={initialMessages}/>
	);
}
