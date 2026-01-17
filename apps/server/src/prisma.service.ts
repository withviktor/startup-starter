import { Injectable } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import prisma from "./lib/prisma";

// Class used as DI token and for typing
@Injectable()
export class PrismaService extends PrismaClient {}

// Provider that injects the shared singleton instead of creating a new instance
export const PrismaProvider = {
	provide: PrismaService,
	useValue: prisma,
};
