import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-xs font-semibold tracking-[0.22em] text-bark uppercase">404</p>
      <h1 className="mt-3 font-display text-5xl text-ink">This page doesn’t exist.</h1>
      <Link
        href="/"
        className="btn btn-solid mt-8"
      >
        Home
      </Link>
    </Container>
  );
}
