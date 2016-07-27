using System.Web;
using System.Web.Optimization;
using System.Web.Optimization.React;

namespace myActivities
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/materialize.css",
                    "~/Content/pickadate-blue.css",
                    "~/Content/reactbeat.css",
                    "~/Content/site.css"));

            //React with Add-Ons
            bundles.Add(new ScriptBundle("~/bundles/reactlib").IncludeDirectory(
                   "~/Scripts/React/build","*.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                      "~/Scripts/materialize.js",
                      "~/Scripts/clipboard.js",
                      "~/Scripts/respond.js"));


            //React Views
            bundles.Add(new BabelBundle("~/bundles/reactreportview").Include(
                        "~/Scripts/React/App/getReport.jsx",
                        "~/Scripts/React/App/myActivities.jsx"

            ));

           BundleTable.EnableOptimizations = true;
        }
    }
}
