import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/code-on-demand/calculator:
 *   get:
 *     summary: Get a calculator function as code on demand
 *     description: Returns a JavaScript module that can be executed in the browser console
 *     responses:
 *       200:
 *         description: Returns a JavaScript module as text
 *         content:
 *           application/javascript:
 *             schema:
 *               type: string
 */
router.get('/calculator', (req: Request, res: Response) => {
  // Set the content type to JavaScript
  res.setHeader('Content-Type', 'application/javascript');
  
  // Return a JavaScript module that can be executed in the console
  res.send(`
    // Code on Demand Example - Calculator Module
    window.calculator = {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      multiply: (a, b) => a * b,
      divide: (a, b) => b !== 0 ? a / b : 'Cannot divide by zero',
      
      // Example usage function
      demo: function() {
        console.log('Calculator Demo:');
        console.log('5 + 3 =', this.add(5, 3));
        console.log('10 - 4 =', this.subtract(10, 4));
        console.log('6 * 7 =', this.multiply(6, 7));
        console.log('20 / 5 =', this.divide(20, 5));
        console.log('10 / 0 =', this.divide(10, 0));
      }
    };

    // Run the demo
    calculator.demo();

    // You can now use the calculator in your console like this:
    // calculator.add(10, 5)     // returns 15
    // calculator.subtract(10, 5) // returns 5
    // calculator.multiply(10, 5) // returns 50
    // calculator.divide(10, 5)   // returns 2
  `);
});

export default router; 