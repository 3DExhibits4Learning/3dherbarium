"use client"

export function MessageForm() {

return (
    <>
     <div>
      <h2>Send a Message</h2>
      <div>
        <p><strong>To:</strong> Jane Doe (jdoe)</p>
      </div>
      <form>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" placeholder="Enter the subject" />
        </div>
        <div>
          <label htmlFor="body">Message:</label>
          <textarea id="body" placeholder="Write your message here" rows={6}></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
    </>
)
}
