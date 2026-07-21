async function main(): Promise<void> {
  // Seed data will be added once core domain services are in place.
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});