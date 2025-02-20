/**
 * @file /app/license/page.tsx
 * 
 * @fileoverview contains information on the license used by the team and its source code.
 */

// Default imports
import Header from '@/components/Header/Header'
import Footer from '@/components/Shared/Foot'

// Main component
const Licensing = () => <>
      <Header headerTitle="contribute" pageRoute="collections" />
      <div className="h-[calc(100vh-177px)] pl-8 pr-8">
        <br></br>
        <p>Copyright 2025 Cal Poly Humboldt Library</p>
        <br></br>
        <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
        <br></br>
        <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
        <br></br>
        <p>THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
      </div>
      <Footer />
    </>

// Export
export default Licensing