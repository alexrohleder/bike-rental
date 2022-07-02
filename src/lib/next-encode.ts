// Next.JS has problems encoding Date objects on getStaticProps and getServerSideProps.
// This function is a workaround to get around that.
function nextEncode<T>(input: T): T {
  return JSON.parse(JSON.stringify(input));
}

export default nextEncode;
